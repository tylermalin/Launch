# Malama Labs Launch Monorepo

## Architecture

DePIN (Decentralized Physical Infrastructure Network) for cryptographic environmental data.
Hardware-signed sensor data flows: Sensor -> Kafka -> AI Validator (OPA/Rego) -> IPFS (Pinata) -> Blockchain (Cardano + Base).

Dual-token model: $MALAMA (governance/utility) + $LCO2/$VCO2 (carbon lifecycle).
Multi-chain: Cardano (Aiken, CIP-68) + Base EVM (Solidity, LayerZero V2).

## Workspace Layout

```
apps/web/            Next.js 16 frontend (Mapbox, Wagmi, MeshSDK)
contracts/evm/       Solidity 0.8.24 (MalamaOFT, SensorDIDRegistry, MalamaOracle)
contracts/cardano/   Aiken validators (genesis, sensor_registry, carbon_lifecycle)
ai-validator/        Python ML validation pipeline + OPA/Rego
firmware/            Raspberry Pi sensor node (ATECC608A + BME680)
pipeline/            Kafka batch processor + 4-hour anchor service
packages/sdk/        Rust + TypeScript SDK (git submodule from malamasensorlab)
docs/                Architecture, audit invariants, threat model
```

## Build Commands

```bash
# Frontend
cd apps/web && npm install && npm run dev

# EVM contracts
cd contracts/evm && npm install && npx hardhat test

# Cardano contracts
cd contracts/cardano && aiken build && aiken check

# AI Validator
cd ai-validator && pip install -r requirements.txt && pytest

# SDK (Rust)
cd packages/sdk && cargo test

# SDK (TypeScript)
cd packages/sdk && npm install && npm run build

# Full pipeline (Docker)
docker-compose -f docker-compose.local.yml up -d
```

## Environment Setup

Copy `.env.example` to `.env` and fill in real values. For `apps/web`, create `apps/web/.env.local`.

Required keys: MAPBOX_TOKEN, PINATA_API_KEY, PINATA_API_SECRET, KAFKA_BOOTSTRAP, BLOCKFROST_PROJECT_ID, BASE_SEPOLIA_RPC_URL.

## Key Invariants

- 52 protocol invariants documented in `docs/audit/invariants.md`
- Sensor reputation [0-100], auto-quarantine below 50, settlement requires >= 80
- Genesis NFT hard cap: 200 Base (ERC-721) + 200 Cardano (CIP-68) = 400 total
- $MALAMA total supply cap: 500M (enforced in MalamaOFT.sol)
- 30-day minting epochs, 10M $MALAMA cap per epoch
- 2-hour challenge window on data submissions
- Confidence >= 0.8 (8000 bps) required for carbon credit minting

## Branch Strategy

- `main` — production-ready code
- `ready-to-go` — current integration branch where active work lands (ahead of `main`)
- Feature branches off `ready-to-go`, PRs back to `ready-to-go`

> ⚠️ Divergence to reconcile: CI (`ci.yml`) and testnet deploy (`deploy-testnet.yml`)
> still trigger on a `develop` branch that does not currently exist on the remote.
> Either create `develop` as the integration branch or repoint those workflows at
> `ready-to-go`.

## CI/CD

- GitHub Actions: Aiken build/test, Hardhat compile/test/coverage, Python pytest, Node typecheck/lint/build
- Testnet deploy: push to `develop` triggers Cardano Pre-Prod + Base Sepolia deployment (see divergence note above — `develop` is currently absent)
- Vercel: `apps/web` auto-deploys from `main`

## Conventions

- Solidity: OpenZeppelin v5, LayerZero V2 OApp patterns
- Aiken: stdlib v3.0.0, Plutus v3
- Frontend: App Router, dynamic imports for wallet components, Tailwind
- Coverage threshold: 80% minimum (EVM, Python)
- Never commit .env files or API keys

