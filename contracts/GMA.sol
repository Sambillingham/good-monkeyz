// SPDX-License-Identifier: MIT

// █▀▀ █▀█ █▀█ █▀▄   █▀▄▀█ █▀█ █▄░█ █▄▀ █▀▀ █▄█ ▀█
// █▄█ █▄█ █▄█ █▄▀   █░▀░█ █▄█ █░▀█ █░█ ██▄ ░█░ █▄
// ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄ ▄▄
// ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░

pragma solidity ^0.8.12;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

interface GMLTDEDITIONS {
    function burnToken(address, uint256 id) external; 
}

contract GMA is ERC721A, Ownable {
    address public GMEditionsAddress = 0x66722f13F6e5dcEB94c5F2aB8e6A2028039e8393;
    uint256 public MINT_PASS_ID = 1;
    uint256 public BOOSTER_PACK_ID = 2;
    uint256 public GENERAL_SUPPLY = 9000;
    uint256 public ALLOW_MAX = 7000;
    uint256 public MINTPASS_MAX = 250;
    uint256 public BOOSTER_MAX = 250;
    uint256 public publicMintMax = 3;
    uint256 public allowMintMax = 2;
    uint256 public price = 0.077 ether;
    uint256 public mintPassUsed;
    uint256 public boosterPacksOpened;
    uint256 public startingIndex;
    uint256 public prizeIndex;
    bool public PUBLIC = false;
    bool public ALLOW = false;
    bool public MINTPASS = false;
    bool public BOOSTER = false;
    string private baseURI;
    string private _contractURI;

    mapping(address => uint256) public mintList;

    event GMMinted(address sender, uint256 tokenId, uint256 amount);

    event AllowStatus(bool status);
    event PublicStatus(bool status);
    event MintPassStatus(bool status);
    event BoostStatus(bool status);

    constructor() ERC721A("GMA", "GM") {}

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function setBaseURI(string memory newURI) external onlyOwner () {
        baseURI = newURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setMerchAddress(address _GMEditionsAddress) public onlyOwner {
        GMEditionsAddress = _GMEditionsAddress;
    }

    function setNewPrice(uint256 _price) external onlyOwner {
        price = _price;
    }
    
    function setNewPublicMax(uint256 _max) external onlyOwner {
        publicMintMax = _max;
    }

    function setNewAllowMax(uint256 _max) external onlyOwner {
        allowMintMax = _max;
    }

    function flipPublicState() external onlyOwner {
        PUBLIC = !PUBLIC;
        emit PublicStatus(PUBLIC);
    }

    function flipAllowState() external onlyOwner {
        ALLOW = !ALLOW;
        emit AllowStatus(ALLOW);
    }

    function flipPassState() external onlyOwner {
        MINTPASS = !MINTPASS;
        emit MintPassStatus(MINTPASS);
    }

    function flipBoosterState() external onlyOwner {
        BOOSTER = !BOOSTER;
        emit BoostStatus(BOOSTER);
    }

    function genStartingIndex() external onlyOwner {
        startingIndex = uint(blockhash(block.number - 1)) % 10000;
        console.log('STARTING INDEX: ', startingIndex);
    }

    function genPrizeIndex() external onlyOwner {
        prizeIndex = uint(blockhash(block.number - 1)) % 7000;
        console.log('Prize INDEX: ', prizeIndex);
    }

    function mint(uint256 _amount) external payable{
        require(PUBLIC , "MINTING - NOT OPEN");
        require(_amount <= publicMintMax , "ABOVE MAX MONKEYZ");
        require(msg.value >= price * _amount, "Not enough ETH sent");
        require(totalSupply() + _amount <= publicAllocation(), "Public Allocation Sold out");
        require(msg.sender == tx.origin, "no bots"); 

        emit GMMinted(msg.sender, _currentIndex, _amount);
        console.log(' mint %s %s', _currentIndex, _amount);
        _safeMint( msg.sender, _amount);
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
        require(totalSupply() + _amount <= ALLOW_MAX + mintPassUsed , "ALLOW list Sold out");
        require(recoverSigner(msg.sender, signature) == owner(), "Address is not allowlisted");
        require(mintList[msg.sender] + _amount <= allowMintMax, "ABOVE MAX MINTS RESERVED");

        console.log(' allow %s %s', _currentIndex,_currentIndex+1);
        
        emit GMMinted(msg.sender, _currentIndex, _amount);
        _safeMint( msg.sender, _amount);
        mintList[msg.sender] = _amount ;      
    }

    function mintWithPass() external {
        require(MINTPASS , "MINTING WITH PASS - NOT OPEN");
        require(mintPassUsed < MINTPASS_MAX, "MINT PASS ALLOCATION USED");

        GMLTDEDITIONS(GMEditionsAddress).burnToken(msg.sender, MINT_PASS_ID);

        console.log(' MINTPASS%s', _currentIndex);
        emit GMMinted(msg.sender, _currentIndex, 1);
        _safeMint( msg.sender, 1);
        ++mintPassUsed;
    }

    function mintWithBoosterPack() external {
        require(BOOSTER , "MINTING WITH BOOSTER PACK - NOT OPEN");
        GMLTDEDITIONS(GMEditionsAddress).burnToken(msg.sender, BOOSTER_PACK_ID); // fail if user does not have passId2

        emit GMMinted(msg.sender, _currentIndex, 3);
        console.log(' booster %s %s %s', _currentIndex, _currentIndex+1, _currentIndex+2);
        _safeMint( msg.sender, 3);
        ++boosterPacksOpened;
    }

    function publicAllocation() internal view returns (uint256){
        return GENERAL_SUPPLY + mintPassUsed + boosterPacksOpened*3;
    }
    
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
