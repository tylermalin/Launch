// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title  Mālama Labs Hex Node License — Genesis 200
/// @notice ERC-721 NFT representing exclusive geographic hex territory rights
///         on the Mālama DePIN network. 200 total supply, one per hex cell.
contract GenesisValidator is ERC721, Ownable {
    using SafeERC20 for IERC20;
    using Strings for uint256;

    // ─── Constants ──────────────────────────────────────────────────────────
    uint256 public constant MAX_GENESIS_SUPPLY = 200;

    // ─── State ───────────────────────────────────────────────────────────────
    IERC20  public immutable paymentToken;
    address public treasury;
    uint256 public mintPrice;
    string  private _baseTokenURI;

    uint256 private _currentSupply;

    // Geographic Spatial Storage
    mapping(uint256 => string) private _tokenHexBoundaries;
    mapping(string  => bool)   private _hexClaimed;
    mapping(string  => uint256) private _hexToTokenId;

    // ─── Events ──────────────────────────────────────────────────────────────
    event NodeSecured(address indexed operator, uint256 indexed tokenId, string hexId);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);

    // ─── Constructor ─────────────────────────────────────────────────────────
    /// @param _paymentToken  ERC-20 token used for payment (USDC, 6 decimals)
    /// @param _treasury      Multi-sig or vault that receives payments
    /// @param _initialPrice  Price in payment-token base units ($2,000 USDC = 2_000_000_000)
    /// @param baseURI_       Base URI for tokenURI metadata (e.g. https://malamalaunch.vercel.app/api/nft/)
    constructor(
        address _paymentToken,
        address _treasury,
        uint256 _initialPrice,
        string memory baseURI_
    ) ERC721("Malama Hex Node License", "MHNL") Ownable(msg.sender) {
        require(_paymentToken != address(0), "Invalid payment token");
        require(_treasury     != address(0), "Invalid treasury");

        paymentToken   = IERC20(_paymentToken);
        treasury       = _treasury;
        mintPrice      = _initialPrice;
        _baseTokenURI  = baseURI_;
    }

    // ─── Public: Purchase ────────────────────────────────────────────────────
    /// @notice Purchase and mint a Hex Node License NFT.
    ///         Caller must first approve this contract to spend `mintPrice` of paymentToken.
    /// @param hexId  H3 hex cell index string (e.g. "872a100aaffffff")
    function secureNode(string calldata hexId) external {
        require(_currentSupply < MAX_GENESIS_SUPPLY, "Genesis 200: All nodes sold");
        require(bytes(hexId).length > 0,             "Empty hex ID");
        require(!_hexClaimed[hexId],                  "Hex already claimed");

        // Collect payment
        paymentToken.safeTransferFrom(msg.sender, treasury, mintPrice);

        // Mint
        uint256 tokenId = _currentSupply + 1;
        _currentSupply  = tokenId;

        _tokenHexBoundaries[tokenId] = hexId;
        _hexClaimed[hexId]           = true;
        _hexToTokenId[hexId]         = tokenId;

        _safeMint(msg.sender, tokenId);
        emit NodeSecured(msg.sender, tokenId, hexId);
    }

    // ─── Admin: Mint on behalf (Cardano-path / off-chain payment) ────────────
    /// @notice Owner can mint directly to an address (for Cardano flow or offline payments).
    function adminSecureNode(address to, string calldata hexId) external onlyOwner {
        require(_currentSupply < MAX_GENESIS_SUPPLY, "Genesis 200: All nodes sold");
        require(bytes(hexId).length > 0,             "Empty hex ID");
        require(!_hexClaimed[hexId],                  "Hex already claimed");
        require(to != address(0),                    "Invalid recipient");

        uint256 tokenId = _currentSupply + 1;
        _currentSupply  = tokenId;

        _tokenHexBoundaries[tokenId] = hexId;
        _hexClaimed[hexId]           = true;
        _hexToTokenId[hexId]         = tokenId;

        _safeMint(to, tokenId);
        emit NodeSecured(to, tokenId, hexId);
    }

    // ─── View ─────────────────────────────────────────────────────────────────
    function getHexByToken(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenHexBoundaries[tokenId];
    }

    function getTokenByHex(string calldata hexId) external view returns (uint256) {
        require(_hexClaimed[hexId], "Hex not claimed");
        return _hexToTokenId[hexId];
    }

    function isHexClaimed(string calldata hexId) external view returns (bool) {
        return _hexClaimed[hexId];
    }

    function totalSupply() external view returns (uint256) {
        return _currentSupply;
    }

    function remaining() external view returns (uint256) {
        return MAX_GENESIS_SUPPLY - _currentSupply;
    }

    // ─── ERC-721 Metadata ─────────────────────────────────────────────────────
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /// @notice Returns metadata URI: baseURI + tokenId
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    // ─── Admin Config ────────────────────────────────────────────────────────
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        emit PriceUpdated(mintPrice, newPrice);
        mintPrice = newPrice;
    }

    function emergencyExtract(address _token) external onlyOwner {
        IERC20 t = IERC20(_token);
        t.safeTransfer(treasury, t.balanceOf(address(this)));
    }
}
