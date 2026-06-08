// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title MalamaTimelock
 * @notice Timelock that governs every privileged action on the Malama protocol
 *         contracts (OFT peers/delegate/config, oracle/distributor wiring, NFT
 *         treasury/price, etc.).
 *
 * Security model — "multisig + timing", the recognised mitigation for LayerZero
 * OApp/OFT takeovers:
 *   - The Mālama **Gnosis Safe multisig** is the sole PROPOSER and EXECUTOR.
 *   - A non-zero **minDelay** (recommend 48h) sits between scheduling and
 *     executing any owner action, so a malicious or mistaken change (e.g. a
 *     hostile setPeer / setDelegate) is publicly visible and cancellable before
 *     it can take effect.
 *   - No admin role is granted (admin = address(0)): the timelock cannot be
 *     reconfigured outside its own delayed, multisig-gated process.
 *
 * Ownership of MalamaOFT (and the other Ownable contracts) is transferred to an
 * instance of this contract; the OFT's LayerZero `delegate` is set to the Safe.
 * After that, all admin calls flow: Safe → timelock.schedule → wait minDelay →
 * timelock.execute. See SECURITY.md.
 */
contract MalamaTimelock is TimelockController {
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
