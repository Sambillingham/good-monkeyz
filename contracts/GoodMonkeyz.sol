// SPDX-License-Identifier: MIT

// █▀▀ █▀█ █▀█ █▀▄   █▀▄▀█ █▀█ █▄░█ █▄▀ █▀▀ █▄█ ▀█
// █▄█ █▄█ █▄█ █▄▀   █░▀░█ █▄█ █░▀█ █░█ ██▄ ░█░ █▄
// ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄
// ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

interface GMLTDEDITIONS {
    function burnToken(address, uint256 id) external; 
}

contract GoodMonkeyz is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private tokenId;
    address public GMEditionsAddress;
    uint256 public MINT_PASS_ID = 1;
    uint256 public BOOSTER_PACK_ID = 2;
    uint256 public GENERAL_SUPPLY = 9000;
    uint256 public ALLOW_MAX = 7000;
    uint256 public MINTPASS_MAX = 250;
    uint256 public BOOSTER_MAX = 250;
    uint256 public PUBLIC_MINT_MAX = 10;
    uint256 public price = 0.077 ether;
    uint256 public mintPassUsed;
    uint256 public boosterPacksOpened;
    uint256 public startingIndex;
    bool public PUBLIC = false;
    bool public ALLOW = false;
    bool public MINTPASS = false;
    bool public BOOSTER = false;
    string private baseURI;
    string private _contractURI;

    mapping(address => uint256) public mintList;

    event GMMinted(address sender, uint256 tokenId);

    constructor() ERC721("GOOD MONKEYZ", "GM") {
        tokenId.increment();
    }

    function setBaseURI(string memory newURI) external onlyOwner () {
        baseURI = newURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setMerchAddress(address _GMEditionsAddress) public onlyOwner {
        GMEditionsAddress = _GMEditionsAddress;
        console.log("GMSHOP Contract updated to %s", GMEditionsAddress);
    }

    // Flip public sale state
    function flipPublicState() external onlyOwner {
        PUBLIC = !PUBLIC;
    }

    // Flip allowlist sale state
    function flipAllowState() external onlyOwner {
        ALLOW = !ALLOW;
    }

    // Flip mintpass sale state
    function flipPassState() external onlyOwner {
        MINTPASS = !MINTPASS;
    }

    // Flip Booster sale state
    function flipBoosterState() external onlyOwner {
        BOOSTER = !BOOSTER;
    }

    function genStartingIndex() external onlyOwner {
        startingIndex = uint(blockhash(block.number - 1)) % 10000;
        console.log('STARTING INDEX: ', startingIndex);
    }
    

    function mint(uint256 _amount) external payable{
        require(PUBLIC , "MINTING - NOT OPEN");
        require(_amount <= PUBLIC_MINT_MAX , "MAX 10 MONKEYZ");
        require(msg.value >= price * _amount, "Not enough ETH sent");
        require(tokenId.current() <= publicAllocation(), "Public Allocation Sold out");
        require(msg.sender == tx.origin, "no bots"); 

        for(uint256 i; i < _amount; i++){
            _safeMint( msg.sender, tokenId.current());
            console.log('mint public %s', tokenId.current());
            emit GMMinted(msg.sender, tokenId.current());
            tokenId.increment();
        }
    }

    function recoverSigner(address _address, bytes memory signature) public pure returns (address) {

        bytes32 messageDigest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(_address))
            )
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function mintAllow(uint256 _amount, bytes memory signature) external payable {
        require(ALLOW , "MINTING ALLOW LIST - NOT OPEN");
        require(msg.value >= price * _amount, "Not enough ETH sent");
        require(tokenId.current() <= ALLOW_MAX + mintPassUsed , "ALLOW list Sold out");
        require(recoverSigner(msg.sender, signature) == owner(), "Address is not allowlisted");
        require(mintList[msg.sender] + _amount <= 2, "ONLY 2 MINTS RESERVED");

        for(uint256 i; i < _amount; i++){
            _safeMint( msg.sender, tokenId.current());
            console.log('mint allow %s', tokenId.current());
            emit GMMinted(msg.sender, tokenId.current());
            tokenId.increment();
            ++mintList[msg.sender];        
        }
    }

    // allow contract to use mint pass
    function mintWithPass() external {
        require(MINTPASS , "MINTING WITH PASS - NOT OPEN");
        require(mintPassUsed < MINTPASS_MAX, "MINT PASS ALLOCATION USED");

        GMLTDEDITIONS(GMEditionsAddress).burnToken(msg.sender, MINT_PASS_ID);
        uint256 id = tokenId.current();
        _safeMint(msg.sender, id);
        emit GMMinted(msg.sender, tokenId.current());
        tokenId.increment();
        ++mintPassUsed;
        console.log('MINT WITH MINTPASS #%s', id);
    }

    // allow contract to use booster
    function mintWithBoosterPack() external {
        require(BOOSTER , "MINTING WITH BOOSTER PACK - NOT OPEN");
        GMLTDEDITIONS(GMEditionsAddress).burnToken(msg.sender, BOOSTER_PACK_ID); // fail if user does not have passId2
        for(uint256 i; i < 3; i++){
            _safeMint( msg.sender, tokenId.current() );
            console.log('mint booster %s', tokenId.current());
            emit GMMinted(msg.sender, tokenId.current());
            tokenId.increment();            
        }
        ++boosterPacksOpened;
    }

    function publicAllocation() internal view returns (uint256){
        return GENERAL_SUPPLY + mintPassUsed + boosterPacksOpened*3;
    }
    
    function totalSupply() external view returns (uint256) {
        uint256 total = tokenId.current() -1;
        return total;
    }

    // need default contract Data for opensea function
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function setContractURI(string memory uri) public onlyOwner {
        _contractURI = uri;
    }

    // IERC2981

    // function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address, uint256 royaltyAmount) {
    //     _tokenId; // silence solc warning
    //     royaltyAmount = (_salePrice / 100) * 7;
    //     return (royalties, royaltyAmount);
    // }

    function withdraw() public onlyOwner() {
        uint256 balance = address(this).balance;
        (bool success, ) = (msg.sender).call{ value: balance }("");
        require(success, "Failed to widthdraw Ether");
    }
}
