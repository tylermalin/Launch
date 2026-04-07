
use aiken/collection/list
use aiken/collection/dict
use aiken/primitive/bytearray
use aiken/interval
use cardano/assets.{PolicyId}
use cardano/address
use cardano/transaction.{
  Transaction, Input, Output, OutputReference, InlineDatum
}
use malama/constants.{admin_pkh, ai_validator_pkh}
use malama/types.{
  CIP68Datum, SensorDIDDatum, SensorDIDMetadata, Active,
  SensorRedeemer, SensorMintRedeemer,
  UpdateReputation, Recalibrate, BurnSensor,
  MintSensor, BurnPair
}
use malama/utils.{
  has_required_signer, validate_cip68_pair_minted, get_continuing_output_datum
}

validator sensor_registry {
  mint(
    redeemer: SensorMintRedeemer,
    policy_id: PolicyId,
    transaction: Transaction,
  ) {
    when redeemer is {
      MintSensor -> {
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
        expect datum: SensorDIDDatum = datum_data
        let meta = datum.extra
        
        expect meta.reputation_score == 100
        expect meta.calibration_age_days == 0
        expect meta.active == True
        expect meta.quarantine == False
        True
      }
      BurnPair -> {
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
    datum: Option<SensorDIDDatum>,
    redeemer: SensorRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(input_datum) = datum
    let input_meta = input_datum.extra

    when redeemer is {
      UpdateReputation -> {
        expect has_required_signer(transaction, ai_validator_pkh) || has_required_signer(transaction, admin_pkh)
        
        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: SensorDIDDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.reputation_score >= 0 && out_meta.reputation_score <= 100
        
        expect out_meta.did == input_meta.did
        expect out_meta.device_pubkey == input_meta.device_pubkey
        expect out_meta.firmware_hash == input_meta.firmware_hash
        expect out_meta.location_h3 == input_meta.location_h3
        expect out_meta.calibration_age_days == input_meta.calibration_age_days
        expect out_meta.ipfs_cid == input_meta.ipfs_cid
        
        if out_meta.quarantine {
          expect out_meta.active == False
          True
        } else {
          True
        }
      }
      Recalibrate -> {
        expect has_required_signer(transaction, admin_pkh)
        
        let cont_datum: Data = get_continuing_output_datum(transaction, output_reference)
        expect parsed_datum: SensorDIDDatum = cont_datum
        let out_meta = parsed_datum.extra

        expect out_meta.calibration_age_days == 0
        expect out_meta.ipfs_cid != input_meta.ipfs_cid

        expect out_meta.did == input_meta.did
        expect out_meta.device_pubkey == input_meta.device_pubkey
        expect out_meta.firmware_hash == input_meta.firmware_hash
        expect out_meta.location_h3 == input_meta.location_h3
        expect out_meta.reputation_score == input_meta.reputation_score
        expect out_meta.quarantine == input_meta.quarantine
        expect out_meta.active == input_meta.active
        True
      }
      BurnSensor -> {
        expect has_required_signer(transaction, admin_pkh)
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

fn mock_sensor_meta() -> SensorDIDMetadata {
  SensorDIDMetadata {
    did: #"d1d1",
    device_pubkey: #"aabb",
    firmware_hash: #"ccdd",
    location_h3: #"eeff",
    status: Active,
    reputation_score: 100,
    calibration_age_days: 0,
    ipfs_cid: #"c1d1",
    active: True,
    quarantine: False,
  }
}

fn mock_sensor_datum(meta: SensorDIDMetadata) -> SensorDIDDatum {
  CIP68Datum { metadata: [], version: 1, extra: meta }
}

fn mock_mint_tx(signer: ByteArray) -> Transaction {
  let mint_val =
    assets.zero
      |> assets.add(mock_policy_id, ref_name, 1)
      |> assets.add(mock_policy_id, user_name, 1)

  let ref_output = Output {
    address: address.from_script(#"1111"),
    value: assets.from_asset(mock_policy_id, ref_name, 1),
    datum: InlineDatum(mock_sensor_datum(mock_sensor_meta())),
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

test test_mint_sensor_valid() {
  let tx = mock_mint_tx(admin_pkh)
  sensor_registry.mint(MintSensor, mock_policy_id, tx)
}

test test_mint_sensor_unauthorized() fail {
  let tx = mock_mint_tx(#"bada")
  sensor_registry.mint(MintSensor, mock_policy_id, tx)
}

fn mock_spend_tx(
  signer: ByteArray,
  in_meta: SensorDIDMetadata,
  out_meta: SensorDIDMetadata,
) -> Transaction {
  let input = Input {
    output_reference: mock_out_ref,
    output: Output {
      address: address.from_script(#"1111"),
      value: assets.zero,
      datum: InlineDatum(mock_sensor_datum(in_meta)),
      reference_script: None,
    }
  }

  let output = Output {
    address: address.from_script(#"1111"),
    value: assets.zero,
    datum: InlineDatum(mock_sensor_datum(out_meta)),
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

test test_update_reputation_by_ai() {
  let in_meta = mock_sensor_meta()
  let out_meta = SensorDIDMetadata { ..in_meta, reputation_score: 95 }
  let tx = mock_spend_tx(ai_validator_pkh, in_meta, out_meta)
  sensor_registry.spend(Some(mock_sensor_datum(in_meta)), UpdateReputation, mock_out_ref, tx)
}

test test_update_reputation_unauthorized() fail {
  let in_meta = mock_sensor_meta()
  let out_meta = SensorDIDMetadata { ..in_meta, reputation_score: 95 }
  let tx = mock_spend_tx(#"bada", in_meta, out_meta)
  sensor_registry.spend(Some(mock_sensor_datum(in_meta)), UpdateReputation, mock_out_ref, tx)
}

test test_update_reputation_out_of_bounds() fail {
  let in_meta = mock_sensor_meta()
  let out_meta = SensorDIDMetadata { ..in_meta, reputation_score: 101 }
  let tx = mock_spend_tx(ai_validator_pkh, in_meta, out_meta)
  sensor_registry.spend(Some(mock_sensor_datum(in_meta)), UpdateReputation, mock_out_ref, tx)
}

test test_quarantine_sets_active_false() {
  let in_meta = mock_sensor_meta()
  let out_meta = SensorDIDMetadata { ..in_meta, quarantine: True, active: False, reputation_score: 50 }
  let tx = mock_spend_tx(ai_validator_pkh, in_meta, out_meta)
  sensor_registry.spend(Some(mock_sensor_datum(in_meta)), UpdateReputation, mock_out_ref, tx)
}

test test_immutable_fields_changed() fail {
  let in_meta = mock_sensor_meta()
  let out_meta = SensorDIDMetadata { ..in_meta, did: #"aabb" }
  let tx = mock_spend_tx(ai_validator_pkh, in_meta, out_meta)
  sensor_registry.spend(Some(mock_sensor_datum(in_meta)), UpdateReputation, mock_out_ref, tx)
}

test test_recalibrate_valid() {
  let in_meta = SensorDIDMetadata { ..mock_sensor_meta(), calibration_age_days: 100 }
  let out_meta = SensorDIDMetadata { ..in_meta, calibration_age_days: 0, ipfs_cid: #"c1d2" }
  let tx = mock_spend_tx(admin_pkh, in_meta, out_meta)
  sensor_registry.spend(Some(mock_sensor_datum(in_meta)), Recalibrate, mock_out_ref, tx)
}
