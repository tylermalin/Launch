// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GenesisValidator is ERC721, Ownable {
    using SafeERC20 for IERC20;

    // Primary Ecosystem Constraints
    uint256 public constant MAX_GENESIS_SUPPLY = 300;
    
    IERC20 public immutable paymentToken;
    address public treasury;
    uint256 public mintPrice;

    uint256 private _currentSupply;
    
    // Geographic Spatial Storage
    mapping(uint256 => string) private _tokenHexBoundaries;
    mapping(string => bool) private _hexClaimed;

    event NodeSecured(address indexed operator, uint256 indexed tokenId, string hexId);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    /**
     * @dev Initialize the Genesis Vault strictly mapping Base Sepolia constraints
     * @param _paymentToken The ERC-20 token address (e.g. USDC) required for settlement
     * @param _treasury Immutable multi-sig or standard vault for retaining node fees
     * @param _initialPrice Dynamic integer structurally tracking exact token valuation criteria (inc decimals)
     */
    constructor(address _paymentToken, address _treasury, uint256 _initialPrice) ERC721("Malama Genesis Validator", "mGEN") Ownable(msg.sender) {
        require(_paymentToken != address(0), "Validation required: Invalid token registry");
        require(_treasury != address(0), "Validation required: Invalid treasury boundary");
        
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
        mintPrice = _initialPrice;
    }

    /**
     * @dev Core entry point for Node Operators acquiring mapped physical territories natively.
     * @param hexId The geometric H3 token identifier isolating the global polygon bounds
     */
    function secureNode(string calldata hexId) external {
        require(_currentSupply < MAX_GENESIS_SUPPLY, "Genesis Operator tier physically exhausted");
        require(bytes(hexId).length > 0, "Topological error: Empty geometry boundary restricted");
        require(!_hexClaimed[hexId], "Topological error: Physical territory already strictly bounded to another Operator");

        // Force native ERC20 transfer of exact structural capital to Treasury
        paymentToken.safeTransferFrom(msg.sender, treasury, mintPrice);

        uint256 nextTokenId = _currentSupply + 1;
        _currentSupply = nextTokenId;

        // Log the math state internally
        _tokenHexBoundaries[nextTokenId] = hexId;
        _hexClaimed[hexId] = true;

        // Mint strictly targeting the caller
        _safeMint(msg.sender, nextTokenId);

        emit NodeSecured(msg.sender, nextTokenId, hexId);
    }

    /**
     * @dev Internal tracking exposing specific Polygon structural coordinates
     */
    function getHexByToken(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token lacks ownership bounds");
        return _tokenHexBoundaries[tokenId];
    }

    /**
     * @dev Rapid diagnostic to strictly prohibit overlapping mappings at checkout execution
     */
    function isHexClaimed(string calldata hexId) external view returns (bool) {
        return _hexClaimed[hexId];
    }

    // --- Admin Configuration ---

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid structural target");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit PriceUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Emergency protocol execution extracting random ERC20 deposits structurally bypassed
     */
    function emergencyExtract(address _token) external onlyOwner {
        IERC20 tempToken = IERC20(_token);
        uint256 balance = tempToken.balanceOf(address(this));
        tempToken.safeTransfer(treasury, balance);
    }
}
