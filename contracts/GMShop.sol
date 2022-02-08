// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "hardhat/console.sol";

contract GMShop is ERC1155, Ownable, ERC1155Burnable {
    constructor()
        ERC1155("https://sambillingham.github.io/test-json/{id}.json")
        {}
    uint256 public mintCost = 0.0001 ether;
    uint256[] public minted = [0,0,0,0,0];
    uint256[] public supply = [2,2,2,2,2];

    event GMShopNFTMinted(address sender, uint256 tokenId);
    event GMShopNFTBurned(address sender, uint256 tokenId);

    address public GMPFPAddress;

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function getMinted() public view returns (uint256[] memory) {
        return minted;
    }

    function mint(uint256 id)
        public
        payable
    {   
        require(msg.value > mintCost, "Not enough ETH sent");
        require(minted[id] < supply[id], "Sold out");
        _mint(msg.sender, id, 1, '');
        minted[id] += 1;
        console.log("An NFT w/ ID %s has been minted to %s", id, msg.sender);
        emit GMShopNFTMinted(msg.sender, id);
    }

    function burnToken(address user, uint256 id)
        public 
    {
        console.log('%s', isApprovedForAll(user, msg.sender ) );
        burn(user, id, 1);
        console.log("An NFT w/ ID %s has been burned on account %s from %s", id, user, msg.sender);
        emit GMShopNFTBurned(msg.sender, id);
    }

}
