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
    uint256 MINT_PASS_ID = 1;
    uint256 BOOSTER_PACK_ID = 2;
    uint256 GENERAL_SUPPLY = 90;
    uint256 ALLOW_MAX = 80;
    uint256 PASS_MAX = 250;
    uint256 price = 0.077 ether;
    uint256 mintPassUsed = 0;
    uint256 boosterPacksOpened = 0;
    bool PUBLIC = false;
    bool ALLOW = false;
    bool PASS = false;
    bool BOOSTER = false;

    constructor() ERC721("GoodMonkeyz", "GM") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://abc.xyz";
    }

    // set URI function needed for updating 
    // function

    function setShopAddress(address _GMEditionsAddress) public onlyOwner {
        GMEditionsAddress = _GMEditionsAddress;
        console.log("GMSHOP Contract updated to %s", GMEditionsAddress);
    }

    function setPublic() external onlyOwner {
        PUBLIC = true;
    }

    function setAllow() external onlyOwner {
        ALLOW = true;
    }

    function setPass() external onlyOwner {
        PASS = true;
    }

    function mint() external payable{
        require(PUBLIC , "MINTING - NOT OPEN");
        require(msg.value >= price, "Not enough ETH sent");
        require(tokenId.current() < GENERAL_SUPPLY + mintPassUsed, "Sold out");

        uint256 id = tokenId.current();
        _safeMint(msg.sender, id);
        console.log('MINT #%s', id);
        tokenId.increment();
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

    function mintAllow(bytes memory signature) public payable {
        require(ALLOW , "MINTING ALLOW LIST - NOT OPEN");
        require(msg.value >= price, "Not enough ETH sent");
        require(tokenId.current() < ALLOW_MAX + mintPassUsed, "ALLOW list Sold out");
        console.log('SENDER: %s', msg.sender);
        require(recoverSigner(msg.sender, signature) == owner(), "Address is not allowlisted");

        uint256 id = tokenId.current();
        _safeMint(msg.sender, id);
        console.log('MINT #%s', id);
        tokenId.increment();
    }
    // function mintAllow2() {
        // - 
    // }

    // allow contract to use mint pass
    function mintWithPass() external {
        require(PASS , "MINTING WITH PASS - NOT OPEN");
        require(mintPassUsed < PASS_MAX, "MINT PASS ALLOCATION USED");

        GMLTDEDITIONS(GMEditionsAddress).burnToken(msg.sender, MINT_PASS_ID);
        uint256 id = tokenId.current();
        _safeMint(msg.sender, id);
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
            console.log('mint %s', tokenId.current());
            tokenId.increment();            
        }
        ++boosterPacksOpened;
    }
    
    // needs to include opened booster pack monkeys?
    function totalSupply() external view returns (uint256) {
        uint256 total = tokenId.current() + mintPassUsed + boosterPacksOpened*3;
        return total;
    }

    // allow spedning
    // function swapMintForBooster() external (){
        // if turned on 
        // if under amount
    // }

    // need default contract Data for opensea function

}
