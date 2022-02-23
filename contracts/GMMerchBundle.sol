// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract GMMerchBundle is ERC1155, Ownable, ERC1155Burnable {
    constructor()
        ERC1155("https://sambillingham.github.io/test-json/{id}.json")
        {}
    uint256[] public minted = [0,0];
    uint256[] public supply = [77,250];
    uint256[] public burned = [0,0];
    uint256 public merchBundlePrice = 0.06 ether;
    uint256 public merchBundleIncrement = 0.005 ether;
    uint256 public mintPassPrice = 0.1 ether;
    bool public mintPassMintable = false;
    bool public merchBundleMintable = false;

    event GMMerchBundleNFTMinted(address sender, uint256 tokenId);
    event GMMerchBundleNFTBurned(address sender, uint256 tokenId);

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function updateMerchBundleStatus() public onlyOwner () {
        merchBundleMintable = !merchBundleMintable;
    }

    function updateMintPassStatus() public onlyOwner () {
        mintPassMintable = !mintPassMintable;
    }

    function getMerchBundlePrice() public view returns (uint256) {
        return merchBundlePrice;
    }

    function setMerchBundlePrice(uint256 price) public onlyOwner  () {
        merchBundlePrice = price;
    }
    function setMintPassPrice(uint256 price) public onlyOwner  () {
        mintPassPrice = price;
    }

    function getMinted() public view returns (uint256[] memory) {
        return minted;
    }
    function getBurned() public view returns (uint256[] memory) {
        return burned;
    }

    function mintMerch() public payable {
        require(merchBundleMintable , "MERCH MINTING - NOT ACTIVE");
        require(msg.value >= merchBundlePrice, "Not enough ETH sent");
        require(minted[0] <= supply[0], "Sold out");
        _mint(msg.sender, 0, 1, '');
        _mint(msg.sender, 1, 1, '');

        if( (minted[0] + 1) % 5 == 0 ) {
            merchBundlePrice += merchBundleIncrement;
        }
        minted[0] += 1;
        emit GMMerchBundleNFTMinted(msg.sender, 0);
    }

    function mintMintPass() public payable {
        require(mintPassMintable , "MINT PASS MINTING - NOT ACTIVE");
        require(msg.value >= mintPassPrice, "Not enough ETH sent");
        require(minted[1] < supply[1], "Sold out");
        _mint(msg.sender, 1, 1, '');
        minted[1] += 1;
        emit GMMerchBundleNFTMinted(msg.sender, 1);
    }
    
    function mintMintPassAdmin(address to) public onlyOwner {
        require(minted[1] < supply[1], "Sold out");
        _mint(to, 1, 1, '');
        minted[1] += 1;
    }

    function burnToken(address user, uint256 id) public {
        burn(user, id, 1);
        burned[id] += 1;
        emit GMMerchBundleNFTBurned(user, id);
    }

    function withdraw() public onlyOwner() {
        uint256 balance = address(this).balance;
        (bool success, ) = (msg.sender).call{ value: balance }("");
        require(success, "Failed to widthdraw Ether");
    }
}