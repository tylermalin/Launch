# Mālama Contracts — Privileged-Access Security Model

LayerZero OFT/OApp takeovers almost always happen through a **single owner key**
making an instant malicious config change — most often a hostile `setPeer`
(re-point a trusted remote) or `setDelegate` (hand over LayerZero config). The
mitigation is **multisig + timing**: no single key can act, and every privileged
action sits behind a public, cancellable delay.

## Model

```
Mālama Gnosis Safe (multisig)  ──proposes──▶  MalamaTimelock (48h delay)  ──owns──▶  MalamaOFT / GenesisValidator / MalamaOracle / SensorDIDRegistry
```

- **Owner** of every privileged contract = `MalamaTimelock`.
- **Proposer + Executor** of the timelock = the **Safe** (no other party; no admin role).
- **`minDelay` = 48h** (configurable): the gap between scheduling and executing.
- **OFT `delegate`** (LayerZero config authority) = the **Safe**.

Net effect: a malicious `setPeer`/`setDelegate`/mint/treasury change must be
proposed by the multisig, then waits 48h in the open, where it can be cancelled
before it ever executes.

## A. Harden a fresh deployment (this repo)

```bash
export SAFE_ADDRESS=0xYourGnosisSafe
export TIMELOCK_MIN_DELAY=172800            # 48h (default)
cd contracts/evm
npx hardhat deploy --tags harden --network base    # or baseSepolia
```
This deploys `MalamaTimelock`, sets the OFT delegate to the Safe, and transfers
ownership of every deployed contract to the timelock.

## B. Harden an ALREADY-deployed contract (e.g. mainnet Genesis `0x93c2…`)

It's currently owned directly by the Safe. To add the timing layer:

1. Deploy the timelock alone:
   ```bash
   SAFE_ADDRESS=0xYourSafe npx hardhat deploy --tags harden --network base
   # (contracts already owned by the Safe will be skipped for transfer; grab the
   #  deployed MalamaTimelock address from the logs)
   ```
2. From the **Safe**, call `transferOwnership(<timelock>)` on each contract
   (and `setDelegate(<Safe>)` on the OFT). Do this as Safe transactions.

> ⚠️ Don't transfer ownership to the timelock until the Safe is confirmed as the
> timelock's proposer/executor — otherwise you can lock yourself out.

## C. Performing an admin action after hardening

Example: set a LayerZero peer on the OFT. All calls go through the timelock,
proposed/executed by the Safe.

```
target   = MalamaOFT address
value    = 0
data     = OFT.interface.encodeFunctionData("setPeer", [eid, peerBytes32])
predecessor = 0x0
salt        = <random bytes32>

# 1) Safe → timelock.schedule(target, value, data, predecessor, salt, minDelay)
# 2) wait minDelay (48h)
# 3) Safe → timelock.execute(target, value, data, predecessor, salt)
# Cancel a pending op anytime before execution: Safe → timelock.cancel(id)
```

The same flow covers `setDelegate`, `setEnforcedOptions`, `setBMEOracle`,
`setRewardDistributor`, `initialMint`, `finalizeInitialMint`, and the NFT
treasury/price setters.

## Recommended additional hardening (not yet implemented — needs audit)

- **Rate limiting** on cross-chain transfers (LayerZero `RateLimiter`) to cap
  blast radius if a peer is ever compromised. This is an OFT *logic* change →
  must be audited and redeployed; do not add it unaudited.
- **DVN / block-confirmation config** reviewed and set via the Safe+timelock.
- **Renounce** `initialMint` authority via `finalizeInitialMint()` once TGE
  allocations are done, so that path is permanently closed.

## Scope note

This repo's hardening applies to deployments **made from this repo**. The
currently-live contracts (Genesis on Base mainnet, and Dom's Dagwell-wired
builds) are deployed separately — securing those requires running step **B**
against each live address from the Safe.
