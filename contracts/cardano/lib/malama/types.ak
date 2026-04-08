// CIP-68 standard for dynamic datums
pub type CIP68Datum<t> {
  metadata: Pairs<ByteArray, Data>,
  version: Int,
  extra: t,
}

// Validator Status
pub type ValidatorStatus {
  Pending
  Active
  Suspended
}

// Sensor DID Types
pub type SensorDIDMetadata {
  did: ByteArray,
  device_pubkey: ByteArray,  // ecdsa secp256r1 or secp256k1
  firmware_hash: ByteArray,
  location_h3: ByteArray,
  status: ValidatorStatus,
  reputation_score: Int,
  calibration_age_days: Int,
  ipfs_cid: ByteArray,
  active: Bool,
  quarantine: Bool,
}

pub type SensorDIDDatum =
  CIP68Datum<SensorDIDMetadata>

// Genesis Validator Types
pub type GenesisValidatorMetadata {
  genesis_number: Int,
  status: ValidatorStatus,
  buyer_pkh: ByteArray,
  sensor_did: ByteArray,
  hardware_fingerprint: ByteArray,
  activated_at: Int,
  malama_earned_lifetime: Int,
  validation_uptime_bps: Int,
  disputes_resolved: Int,
}

pub type GenesisValidatorDatum =
  CIP68Datum<GenesisValidatorMetadata>

// Carbon Token Types
pub type CarbonClass {
  LCO2
  VCO2
}

pub type RegistryStatus {
  PendingVVB
  VVBApproved
  Converted
  Retired
}

pub type CarbonTokenMetadata {
  carbon_class: CarbonClass,
  amount_kg: Int,
  sensor_did: ByteArray,
  mint_timestamp: Int,
  registry_status: RegistryStatus,
  vvb_signature: ByteArray, // signature if approved
  confidence_bps: Int,
  retire_address: ByteArray,
  retire_timestamp: Int,
}

pub type CarbonTokenDatum =
  CIP68Datum<CarbonTokenMetadata>

// Redeemers

pub type SensorRedeemer {
  UpdateReputation
  Recalibrate
  BurnSensor
}

pub type SensorMintRedeemer {
  MintSensor
  BurnPair
}

pub type GenesisRedeemer {
  ActivatePending {
    sensor_did: ByteArray,
    hardware_fingerprint: ByteArray,
    activation_sig: ByteArray,
  }
  UpdatePerformance {
    malama_earned: Int,
    uptime_bps: Int,
    disputes: Int,
  }
  SuspendValidator
}

pub type GenesisMintRedeemer {
  MintGenesis
  BurnGenesis
}

pub type CarbonSpendRedeemer {
  MintLCO2 { merkle_root: ByteArray, sensor_dids: List<ByteArray>, tonnes_co2e_grams: Int }
  ConvertToVCO2 { vvb_approval_sig: Option<ByteArray> }
  RetireVCO2
}

pub type CarbonMintRedeemer {
  MintCarbon
  BurnCarbon
}
