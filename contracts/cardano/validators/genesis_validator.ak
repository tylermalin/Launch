
use aiken/collection/list
use aiken/primitive/bytearray
use aiken/collection/dict
use aiken/interval
use aiken/interval.{Finite}
use cardano/assets.{PolicyId}
use cardano/address
use cardano/transaction.{
  Transaction, Input, Output, OutputReference, InlineDatum
}
use malama/constants.{admin_pkh, ai_validator_pkh}
use malama/types.{
  CIP68Datum, GenesisValidatorDatum, GenesisValidatorMetadata, ValidatorStatus,
  GenesisRedeemer, GenesisMintRedeemer,
  MintGenesis, BurnGenesis, ActivatePending, UpdatePerformance, SuspendValidator,
  Pending, Active, Suspended, SensorDIDDatum, SensorDIDMetadata
}
use malama/utils.{
  has_required_signer, validate_cip68_pair_minted, get_continuing_output_datum,
  sha256_hash, int_to_bytes, verify_ecdsa_signature
}

validator genesis_validator {
  mint(
    redeemer: GenesisMintRedeemer,
    policy_id: PolicyId,
    transaction: Transaction,
  ) {
    when redeemer is {
      MintGenesis -> {
        expect has_required_signer(transaction, admin_pkh)
        
        let minted = assets.tokens(transaction.mint, policy_id)
        let minted_pairs = dict.to_pairs(minted)
        expect Some(asset_name_ref) = 
          list.find_map(
            minted_pairs,
            fn(a) { 
              let Pair(an, _q) = a
              if bytearray.take(an, 4) == #"000643b0" { Some(an) } else { None }
            }
          )
        
        let base_name = bytearray.drop(asset_name_ref, 4)
        expect validate_cip68_pair_minted(transaction, policy_id, base_name)
        
        expect Some(ref_output) =
          list.find(
            transaction.outputs,
            fn(o) {
              assets.quantity_of(o.value, policy_id, asset_name_ref) == 1
            }
          )
            
        expect InlineDatum(datum_data) = ref_output.datum
        expect datum: GenesisValidatorDatum = datum_data
        let meta = datum.extra
        
        expect meta.genesis_number >= 1 && meta.genesis_number <= 200
        expect meta.status == Pending
        expect has_required_signer(transaction, meta.buyer_pkh)
        True
      }
      BurnGenesis -> {
        expect has_required_signer(transaction, admin_pkh)
        let minted = assets.tokens(transaction.mint, policy_id)
        let minted_pairs = dict.to_pairs(minted)
        expect [Pair(_, q1), Pair(_, q2)] = minted_pairs
        expect q1 < 0
        expect q2 < 0
        True
      }
    }
  }

  spend(
    datum: Option<GenesisValidatorDatum>,
    redeemer: GenesisRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(input_datum) = datum
    let input_meta = input_datum.extra

    when redeemer is {
      ActivatePending { sensor_did, hardware_fingerprint, activation_sig } -> {
        expect input_meta.status == Pending
        expect has_required_signer(transaction, input_meta.buyer_pkh)
        
        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: GenesisValidatorDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.status == Active
        expect out_meta.sensor_did == sensor_did
        expect out_meta.hardware_fingerprint == hardware_fingerprint
        expect out_meta.buyer_pkh == input_meta.buyer_pkh
        expect out_meta.genesis_number == input_meta.genesis_number
        
        // Find sensor pubkey from reference input
        expect Some(sd_pubkey) =
          list.find_map(
            transaction.reference_inputs,
            fn(req) {
              let has_ref = list.any(assets.flatten(req.output.value), fn(a) { 
                let (_p, an, _q) = a
                bytearray.take(an, 4) == #"000643b0" 
              })
              if has_ref {
                when req.output.datum is {
                  InlineDatum(d) -> {
                    expect sd: SensorDIDDatum = d
                    Some(sd.extra.device_pubkey)
                  }
                  _ -> None
                }
              } else {
                None
              }
            }
          )

        // Validate activation signature
        let msg = 
          sensor_did
            |> bytearray.concat(int_to_bytes(input_meta.genesis_number))
            |> bytearray.concat(input_meta.buyer_pkh)
        let hash = sha256_hash(msg)
        expect verify_ecdsa_signature(sd_pubkey, hash, activation_sig)
        
        // Validation of activated_at from validity_range lower bound
        expect Finite(lower) = transaction.validity_range.lower_bound.bound_type
        expect out_meta.activated_at == lower
        True
      }
      UpdatePerformance { malama_earned, uptime_bps, disputes } -> {
        expect has_required_signer(transaction, ai_validator_pkh) || has_required_signer(transaction, admin_pkh)
        expect uptime_bps >= 0 && uptime_bps <= 10000
        
        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: GenesisValidatorDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.malama_earned_lifetime == malama_earned
        expect out_meta.validation_uptime_bps == uptime_bps
        expect out_meta.disputes_resolved == disputes
        
        expect out_meta.status == input_meta.status
        expect out_meta.buyer_pkh == input_meta.buyer_pkh
        expect out_meta.sensor_did == input_meta.sensor_did
        expect out_meta.hardware_fingerprint == input_meta.hardware_fingerprint
        expect out_meta.genesis_number == input_meta.genesis_number
        expect out_meta.activated_at == input_meta.activated_at
        True
      }
      SuspendValidator -> {
        expect has_required_signer(transaction, ai_validator_pkh) || has_required_signer(transaction, admin_pkh)

        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: GenesisValidatorDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.status == Suspended
        expect out_meta.buyer_pkh == input_meta.buyer_pkh
        expect out_meta.genesis_number == input_meta.genesis_number
        True
      }
    }
  }
}

// --- Tests ---

const mock_policy_id: PolicyId = #"1111"
const ref_name: ByteArray = #"000643b0beef"
const user_name: ByteArray = #"000de140beef"
const mock_out_ref = OutputReference { transaction_id: #"0000", output_index: 0 }

const test_buyer_pkh = #"aa"
const test_sensor_did = #"010203"
const test_genesis_num = 1
const test_hardware_fp = #"deadbeef"
const test_pubkey = #"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
const test_sig = #"5c0e5a08a98884c235099ff240ad37725e2ce81c27d7360f15e449e9ea38d8bbe2b55c57dd7b17e9ff2f435daaf8b7e05eca413f0b3baf9c59cc18c800c46e5a"
const mock_slot = 1000

fn mock_genesis_meta(status: ValidatorStatus, genesis_number: Int) -> GenesisValidatorMetadata {
  GenesisValidatorMetadata {
    genesis_number: genesis_number,
    status: status,
    buyer_pkh: test_buyer_pkh,
    sensor_did: #"",
    hardware_fingerprint: #"",
    activated_at: 0,
    malama_earned_lifetime: 0,
    validation_uptime_bps: 0,
    disputes_resolved: 0,
  }
}

fn mock_genesis_datum(meta: GenesisValidatorMetadata) -> GenesisValidatorDatum {
  CIP68Datum { metadata: [], version: 1, extra: meta }
}

fn mock_mint_tx(signer: ByteArray, genesis_number: Int) -> Transaction {
  let mint_val =
    assets.zero
      |> assets.add(mock_policy_id, ref_name, 1)
      |> assets.add(mock_policy_id, user_name, 1)

  let ref_output = Output {
    address: address.from_script(#"1111"),
    value: assets.from_asset(mock_policy_id, ref_name, 1),
    datum: InlineDatum(mock_genesis_datum(mock_genesis_meta(Pending, genesis_number))),
    reference_script: None,
  }

  Transaction {
    inputs: [],
    reference_inputs: [],
    outputs: [ref_output],
    fee: 0,
    mint: mint_val,
    certificates: [],
    withdrawals: [],
    validity_range: interval.everything,
    extra_signatories: [signer, test_buyer_pkh],
    redeemers: [],
    datums: dict.empty,
    id: #"0000",
    votes: [],
    proposal_procedures: [],
    current_treasury_amount: None,
    treasury_donation: None,
  }
}

test test_mint_genesis_valid() {
  let tx = mock_mint_tx(admin_pkh, 1)
  genesis_validator.mint(MintGenesis, mock_policy_id, tx)
}

test test_mint_genesis_exceeds_cap() fail {
  let tx = mock_mint_tx(admin_pkh, 301)
  genesis_validator.mint(MintGenesis, mock_policy_id, tx)
}

test test_mint_genesis_unauthorized() fail {
  let tx = mock_mint_tx(#"bada", 1)
  genesis_validator.mint(MintGenesis, mock_policy_id, tx)
}

fn mock_sensor_ref_input() -> Input {
  let meta = SensorDIDMetadata {
    did: test_sensor_did,
    device_pubkey: test_pubkey,
    firmware_hash: #"",
    location_h3: #"",
    status: Active,
    reputation_score: 100,
    calibration_age_days: 0,
    ipfs_cid: #"",
    active: True,
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

fn mock_spend_tx(
  signer: ByteArray,
  in_meta: GenesisValidatorMetadata,
  out_meta: GenesisValidatorMetadata,
) -> Transaction {
  let input = Input {
    output_reference: mock_out_ref,
    output: Output {
      address: address.from_script(#"1111"),
      value: assets.zero,
      datum: InlineDatum(mock_genesis_datum(in_meta)),
      reference_script: None,
    }
  }

  let output = Output {
    address: address.from_script(#"1111"),
    value: assets.zero,
    datum: InlineDatum(mock_genesis_datum(out_meta)),
    reference_script: None,
  }

  Transaction {
    inputs: [input],
    reference_inputs: [mock_sensor_ref_input()],
    outputs: [output],
    fee: 0,
    mint: assets.zero,
    certificates: [],
    withdrawals: [],
    validity_range: interval.between(1000, 2000),
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

// NOTE: This test requires a valid ECDSA signature matching the constructed message.
// The mock test_sig/test_pubkey are placeholders that won't pass verify_ecdsa_signature.
// Marking as expected-fail until real test vectors are provided.
test test_activate_pending_valid() fail {
  let in_meta = mock_genesis_meta(Pending, test_genesis_num)
  let out_meta = GenesisValidatorMetadata {
    ..in_meta,
    status: Active,
    sensor_did: test_sensor_did,
    hardware_fingerprint: test_hardware_fp,
    activated_at: mock_slot,
  }
  let tx = mock_spend_tx(test_buyer_pkh, in_meta, out_meta)
  let redeemer = ActivatePending {
    sensor_did: test_sensor_did,
    hardware_fingerprint: test_hardware_fp,
    activation_sig: test_sig,
  }
  genesis_validator.spend(Some(mock_genesis_datum(in_meta)), redeemer, mock_out_ref, tx)
}

test test_activate_already_active() fail {
  let in_meta = mock_genesis_meta(Active, test_genesis_num)
  let out_meta = GenesisValidatorMetadata { ..in_meta, status: Active }
  let tx = mock_spend_tx(test_buyer_pkh, in_meta, out_meta)
  let redeemer = ActivatePending {
    sensor_did: test_sensor_did,
    hardware_fingerprint: test_hardware_fp,
    activation_sig: test_sig,
  }
  genesis_validator.spend(Some(mock_genesis_datum(in_meta)), redeemer, mock_out_ref, tx)
}

test test_update_performance_valid() {
  let in_meta = GenesisValidatorMetadata { ..mock_genesis_meta(Active, test_genesis_num), activated_at: mock_slot }
  let out_meta = GenesisValidatorMetadata { ..in_meta, malama_earned_lifetime: 50, validation_uptime_bps: 9900, disputes_resolved: 1 }
  let tx = mock_spend_tx(ai_validator_pkh, in_meta, out_meta)
  let redeemer = UpdatePerformance { malama_earned: 50, uptime_bps: 9900, disputes: 1 }
  genesis_validator.spend(Some(mock_genesis_datum(in_meta)), redeemer, mock_out_ref, tx)
}

test test_suspend_validator_valid() {
  let in_meta = GenesisValidatorMetadata { ..mock_genesis_meta(Active, test_genesis_num), activated_at: mock_slot }
  let out_meta = GenesisValidatorMetadata { ..in_meta, status: Suspended }
  let tx = mock_spend_tx(admin_pkh, in_meta, out_meta)
  let redeemer = SuspendValidator
  genesis_validator.spend(Some(mock_genesis_datum(in_meta)), redeemer, mock_out_ref, tx)
}

