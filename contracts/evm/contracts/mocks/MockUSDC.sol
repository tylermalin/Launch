// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        // Mint 1 million initial mock USDC directly to the deployer
        _mint(msg.sender, 1000000 * 10 ** decimals()); 
    }

    function decimals() public view virtual override returns (uint8) {
        return 6; // Standard native USDC strictly uses 6 decimals natively on EVM L2s.
    }

    // Unrestricted faucet mint strictly for frontend simulation
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
