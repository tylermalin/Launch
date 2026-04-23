// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { OFT } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract MalamaOFT is OFT {
    address public bmeOracle;
    address public rewardDistributor;

    /// @notice Protocol hard cap on total MLMA supply. Enforced on every mint path.
    uint256 public constant MAX_TOTAL_SUPPLY = 500_000_000 * 1e18;

    uint256 public constant MAX_MINT_PER_EPOCH = 10_000_000 * 1e18;
    uint256 public constant EPOCH_DURATION = 30 days;

    uint256 public currentEpochStart;
    uint256 public mintedThisEpoch;

    /// @notice Once finalized, initialMint is permanently disabled. All further
    ///         issuance flows through mintReward (per-epoch and total-supply capped).
    bool public initialMintFinalized;

    event BMEBurn(address indexed from, uint256 amount);
    event InitialMint(address indexed to, uint256 amount);
    event InitialMintFinalized();

    error Unauthorized();
    error MaxMintExceeded();
    error SupplyCapExceeded();
    error InitialMintClosed();

    constructor(
        address _lzEndpoint,
        address _delegate
    ) OFT("Malama", "MALAMA", _lzEndpoint, _delegate) Ownable(_delegate) {
        currentEpochStart = block.timestamp;
    }

    /// @notice Owner-gated TGE distribution. Used to mint initial allocations
    ///         (treasury, team vesting, investor vesting, ecosystem, liquidity)
    ///         subject to MAX_TOTAL_SUPPLY. Closed by finalizeInitialMint().
    function initialMint(address to, uint256 amount) external onlyOwner {
        if (initialMintFinalized) revert InitialMintClosed();
        if (totalSupply() + amount > MAX_TOTAL_SUPPLY) revert SupplyCapExceeded();
        _mint(to, amount);
        emit InitialMint(to, amount);
    }

    /// @notice Permanently closes the initial-mint phase.
    function finalizeInitialMint() external onlyOwner {
        initialMintFinalized = true;
        emit InitialMintFinalized();
    }

    function setBMEOracle(address _oracle) external onlyOwner {
        bmeOracle = _oracle;
    }

    function setRewardDistributor(address _distributor) external onlyOwner {
        rewardDistributor = _distributor;
    }

    function burnForBME(uint256 amount) external {
        if (msg.sender != bmeOracle) revert Unauthorized();
        // The oracle is authorized to execute BME burns from its own balance 
        // or through allowances. Here, burning directly from msg.sender.
        _burn(msg.sender, amount);
        emit BMEBurn(msg.sender, amount);
    }

    function mintReward(address to, uint256 amount) external {
        if (msg.sender != rewardDistributor) revert Unauthorized();

        if (block.timestamp >= currentEpochStart + EPOCH_DURATION) {
            currentEpochStart = block.timestamp;
            mintedThisEpoch = 0;
        }

        if (mintedThisEpoch + amount > MAX_MINT_PER_EPOCH) {
            revert MaxMintExceeded();
        }
        if (totalSupply() + amount > MAX_TOTAL_SUPPLY) {
            revert SupplyCapExceeded();
        }

        mintedThisEpoch += amount;
        _mint(to, amount);
    }
}
