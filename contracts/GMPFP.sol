// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

interface IGMSHOP {
    function burnToken(address, uint256 id) external; 
}

// mint Early List
// Opne Mint 

contract GMPFP is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public GMShopAddress;

    constructor() ERC721("GM", "GM") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://abc.xyz";
    }

    function setShopAddress(address gmShopAddress) public onlyOwner {
        GMShopAddress = gmShopAddress;
        console.log("GMSHOP Contract updated to %s", GMShopAddress);
    }

    function mintWithPass1() external {
        uint256 passId = 1;
        IGMSHOP(GMShopAddress).burnToken(msg.sender, passId);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        console.log('mint');
    }

    function mintWithPass5() external {
        uint256 passId = 2;
        IGMSHOP(GMShopAddress).burnToken(msg.sender, passId); // fail if user does not have passId2
        for(uint256 i; i < 5; i++){
            _safeMint( msg.sender, _tokenIdCounter.current() );
            console.log('mint %s', _tokenIdCounter.current());
            _tokenIdCounter.increment();
        }
    }
}
