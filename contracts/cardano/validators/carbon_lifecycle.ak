use aiken/collection/list
use aiken/collection/dict
use aiken/primitive/bytearray
use aiken/interval
use cardano/assets.{PolicyId}
use cardano/address
use cardano/address.{Script, VerificationKey}
use cardano/transaction.{Transaction, Input, Output, OutputReference, InlineDatum}
use malama/constants.{admin_pkh, ai_validator_pkh, vvb_registry_pkh, min_confidence_bps_for_lco2, malama_bme_toll_bps}
use malama/types.{
  CIP68Datum, CarbonTokenDatum, CarbonTokenMetadata, CarbonClass,
  CarbonMintRedeemer, CarbonSpendRedeemer,
  MintCarbon, BurnCarbon, MintLCO2, ConvertToVCO2, RetireVCO2,
  LCO2, VCO2, PendingVVB, VVBApproved, Converted, Retired,
  SensorDIDDatum, SensorDIDMetadata, Active, Suspended,
  RegistryStatus
}
use malama/utils.{
  has_required_signer, get_continuing_output_datum
}

validator carbon_lifecycle {
  mint(redeemer: CarbonMintRedeemer, _policy_id: PolicyId, transaction: Transaction) {
    when redeemer is {
      MintCarbon -> {
        expect has_required_signer(transaction, ai_validator_pkh) || has_required_signer(transaction, admin_pkh)
        True
      }
      BurnCarbon -> {
        True
      }
    }
  }

  spend(
    datum: Option<CarbonTokenDatum>,
    redeemer: CarbonSpendRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    when redeemer is {
      MintLCO2 { merkle_root: _merkle_root, sensor_dids, tonnes_co2e_grams } -> {
        expect has_required_signer(transaction, ai_validator_pkh)

        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: CarbonTokenDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.confidence_bps >= min_confidence_bps_for_lco2
        expect out_meta.carbon_class == LCO2
        expect out_meta.registry_status == PendingVVB
        expect tonnes_co2e_grams > 0
        
        expect list.all(sensor_dids, fn(did) {
            let found = list.find_map(transaction.reference_inputs, fn(req) {
              let has_ref = list.any(assets.flatten(req.output.value), fn(a) { 
                let (_p, an, _q) = a
                bytearray.take(an, 4) == #"000643b0" 
              })
              if has_ref {
                when req.output.datum is {
                  InlineDatum(d) -> {
                    expect sd: SensorDIDDatum = d
                    if sd.extra.did == did && sd.extra.reputation_score >= 80 && sd.extra.active {
                      Some(True)
                    } else {
                      None
                    }
                  }
                  _ -> None
                }
              } else {
                None
              }
            })
            found == Some(True)
        })
        True
      }

      ConvertToVCO2 { vvb_approval_sig: _vvb_approval_sig } -> {
        expect Some(input_datum) = datum
        let input_meta = input_datum.extra
        
        expect input_meta.carbon_class == LCO2
        
        let sig_valid = 
          if input_meta.registry_status == VVBApproved { True }
          else {
            has_required_signer(transaction, vvb_registry_pkh)
          }
        expect sig_valid

        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: CarbonTokenDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.carbon_class == VCO2
        expect out_meta.registry_status == Converted
        
        let burn_address = #"00000000000000000000000000000000000000000000000000000000"
        let toll_expected = (input_meta.amount_kg * malama_bme_toll_bps) / 10000
        
        let toll_paid = list.any(transaction.outputs, fn(o) {
          when o.address.payment_credential is {
            Script(hash) -> hash == burn_address
            VerificationKey(hash) -> hash == burn_address
          }
        })
        expect toll_paid || toll_expected == 0
        
        True
      }

      RetireVCO2 -> {
        expect Some(input_datum) = datum
        let input_meta = input_datum.extra

        expect input_meta.carbon_class == VCO2

        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: CarbonTokenDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.registry_status == Retired
        expect out_meta.retire_timestamp > 0
        expect out_meta.retire_address != #""

        True
      }
    }
  }
}

// --- Tests ---

const mock_policy_id: PolicyId = #"1111"
const mock_out_ref = OutputReference { transaction_id: #"0000", output_index: 0 }
const test_burn_address = #"00000000000000000000000000000000000000000000000000000000"
const mock_sensor_did = #"010203"

fn mock_sensor_input(score: Int, is_active: Bool) -> Input {
  let meta = SensorDIDMetadata {
    did: mock_sensor_did,
    device_pubkey: #"",
    firmware_hash: #"",
    location_h3: #"",
    status: if is_active { Active } else { Suspended },
    reputation_score: score,
    calibration_age_days: 0,
    ipfs_cid: #"",
    active: is_active,
    quarantine: False,
  }
  let datum: SensorDIDDatum = CIP68Datum { metadata: [], version: 1, extra: meta }
  Input {
    output_reference: mock_out_ref,
    output: Output {
      address: address.from_script(#"2222"),
      value: assets.from_asset(mock_policy_id, #"000643b0", 1),
      datum: InlineDatum(datum),
      reference_script: None,
    }
  }
}

fn mock_carbon_meta(class: CarbonClass, status: RegistryStatus, conf: Int) -> CarbonTokenMetadata {
  CarbonTokenMetadata {
    carbon_class: class,
    amount_kg: 10000,
    sensor_did: mock_sensor_did,
    mint_timestamp: 100,
    registry_status: status,
    vvb_signature: #"",
    confidence_bps: conf,
    retire_address: #"",
    retire_timestamp: 0,
  }
}

fn mock_carbon_datum(meta: CarbonTokenMetadata) -> CarbonTokenDatum {
  CIP68Datum { metadata: [], version: 1, extra: meta }
}

fn mock_mint_tx(signer: ByteArray, conf: Int, sensor_score: Int, sensor_active: Bool) -> Transaction {
  let out_meta = mock_carbon_meta(LCO2, PendingVVB, conf)
  let input = Input {
    output_reference: mock_out_ref,
    output: Output {
      address: address.from_script(#"1111"),
      value: assets.zero,
      datum: InlineDatum(mock_carbon_datum(out_meta)),
      reference_script: None,
    }
  }
  let output = Output {
    address: address.from_script(#"1111"),
    value: assets.zero,
    datum: InlineDatum(mock_carbon_datum(out_meta)),
    reference_script: None,
  }
  Transaction {
    inputs: [input],
    reference_inputs: [mock_sensor_input(sensor_score, sensor_active)],
    outputs: [output],
    fee: 0,
    mint: assets.zero,
    certificates: [],
    withdrawals: [],
    validity_range: interval.everything,
    extra_signatories: [signer],
    redeemers: [],
    datums: dict.empty,
    id: #"0000",
    votes: [],
    proposal_procedures: [],
    current_treasury_amount: None,
    treasury_donation: None,
  }
}

test test_mint_lco2_valid() {
  let tx = mock_mint_tx(ai_validator_pkh, 8500, 90, True)
  let r = MintLCO2 { merkle_root: #"", sensor_dids: [mock_sensor_did], tonnes_co2e_grams: 10000 }
  carbon_lifecycle.spend(None, r, mock_out_ref, tx)
}

test test_mint_lco2_low_confidence() fail {
  let tx = mock_mint_tx(ai_validator_pkh, 7999, 90, True)
  let r = MintLCO2 { merkle_root: #"", sensor_dids: [mock_sensor_did], tonnes_co2e_grams: 10000 }
  carbon_lifecycle.spend(None, r, mock_out_ref, tx)
}

test test_mint_lco2_inactive_sensor() fail {
  let tx = mock_mint_tx(ai_validator_pkh, 8500, 70, False)
  let r = MintLCO2 { merkle_root: #"", sensor_dids: [mock_sensor_did], tonnes_co2e_grams: 10000 }
  carbon_lifecycle.spend(None, r, mock_out_ref, tx)
}

fn mock_convert_tx(signer: ByteArray, has_toll: Bool, is_lco2: Bool) -> Transaction {
  let in_class = if is_lco2 { LCO2 } else { VCO2 }
  let in_meta = mock_carbon_meta(in_class, PendingVVB, 8500)

  let input = Input {
    output_reference: mock_out_ref,
    output: Output {
      address: address.from_script(#"1111"),
      value: assets.zero,
      datum: InlineDatum(mock_carbon_datum(in_meta)),
      reference_script: None,
    }
  }

  let out_meta = CarbonTokenMetadata { ..in_meta, carbon_class: VCO2, registry_status: Converted }
  let output = Output {
    address: address.from_script(#"1111"),
    value: assets.zero,
    datum: InlineDatum(mock_carbon_datum(out_meta)),
    reference_script: None,
  }

  let burn_out = Output {
    address: address.from_script(test_burn_address),
    value: assets.zero,
    datum: InlineDatum(mock_carbon_datum(out_meta)),
    reference_script: None,
  }

  Transaction {
    inputs: [input],
    reference_inputs: [],
    outputs: if has_toll { [output, burn_out] } else { [output] },
    fee: 0,
    mint: assets.zero,
    certificates: [],
    withdrawals: [],
    validity_range: interval.everything,
    extra_signatories: [signer],
    redeemers: [],
    datums: dict.empty,
    id: #"0000",
    votes: [],
    proposal_procedures: [],
    current_treasury_amount: None,
    treasury_donation: None,
  }
}

test test_convert_to_vco2_valid() {
  let tx = mock_convert_tx(vvb_registry_pkh, True, True)
  let r = ConvertToVCO2 { vvb_approval_sig: None }
  let in_meta = mock_carbon_meta(LCO2, PendingVVB, 8500)
  carbon_lifecycle.spend(Some(mock_carbon_datum(in_meta)), r, mock_out_ref, tx)
}

test test_convert_to_vco2_no_toll() fail {
  let tx = mock_convert_tx(vvb_registry_pkh, False, True)
  let r = ConvertToVCO2 { vvb_approval_sig: None }
  let in_meta = mock_carbon_meta(LCO2, PendingVVB, 8500)
  carbon_lifecycle.spend(Some(mock_carbon_datum(in_meta)), r, mock_out_ref, tx)
}

test test_convert_unauthorized() fail {
  let tx = mock_convert_tx(admin_pkh, True, True)
  let r = ConvertToVCO2 { vvb_approval_sig: None }
  let in_meta = mock_carbon_meta(LCO2, PendingVVB, 8500)
  carbon_lifecycle.spend(Some(mock_carbon_datum(in_meta)), r, mock_out_ref, tx)
}

fn mock_retire_tx(is_lco2: Bool) -> Transaction {
  let in_class = if is_lco2 { LCO2 } else { VCO2 }
  let in_meta = mock_carbon_meta(in_class, Converted, 8500)

  let input = Input {
    output_reference: mock_out_ref,
    output: Output {
      address: address.from_script(#"1111"),
      value: assets.zero,
      datum: InlineDatum(mock_carbon_datum(in_meta)),
      reference_script: None,
    }
  }

  let out_meta = CarbonTokenMetadata { ..in_meta, registry_status: Retired, retire_timestamp: 1000, retire_address: #"ffff" }
  let output = Output {
    address: address.from_script(#"1111"),
    value: assets.zero,
    datum: InlineDatum(mock_carbon_datum(out_meta)),
    reference_script: None,
  }

  Transaction {
    inputs: [input],
    reference_inputs: [],
    outputs: [output],
    fee: 0,
    mint: assets.zero,
    certificates: [],
    withdrawals: [],
    validity_range: interval.everything,
    extra_signatories: [],
    redeemers: [],
    datums: dict.empty,
    id: #"0000",
    votes: [],
    proposal_procedures: [],
    current_treasury_amount: None,
    treasury_donation: None,
  }
}

test test_retire_vco2_valid() {
  let tx = mock_retire_tx(False)
  let in_meta = mock_carbon_meta(VCO2, Converted, 8500)
  let r = RetireVCO2
  carbon_lifecycle.spend(Some(mock_carbon_datum(in_meta)), r, mock_out_ref, tx)
}

test test_retire_non_vco2() fail {
  let tx = mock_retire_tx(True)
  let in_meta = mock_carbon_meta(LCO2, Converted, 8500)
  let r = RetireVCO2
  carbon_lifecycle.spend(Some(mock_carbon_datum(in_meta)), r, mock_out_ref, tx)
}
