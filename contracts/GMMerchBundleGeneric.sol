// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract GMMerchBundleGeneric is ERC1155, Ownable, ERC1155Burnable {
    constructor()
        ERC1155("https://ipfs.io/ipfs/QmPDLZhhtFkNp94PYpa63A5sKPax4dog9K3So1PUjoq9pf/{id}.json")
        {}
    uint256[] public minted = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    uint256[] public supply = [77,250,750,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    uint256[] public burned = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    uint256[] public price = [0.07 ether, 0.1 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether];
    uint256[] public increment = [0.005 ether, 0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether,0 ether];
    bool[] public mintablePublic = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    bool[] public mintableAllow = [true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    bool[] public mintPassIncluded = [true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    
    mapping(address => uint8) private allowList;

    event GMMinted(address sender, uint256 tokenId);
    event GmBurned(address sender, uint256 tokenId);
    
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
    
    function setAllowList(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            allowList[addresses[i]] += 1;
        }
    }
    function checkAllowList(address _address) public view returns (uint256) {
        return allowList[_address];
    }


    function updateMerchDetails(uint256 id, uint256 _supply, uint256 _price, uint256 _inc, bool _allow, bool _open) public onlyOwner () {
        supply[id] = _supply;
        price[id] = _price;
        increment[id] = _inc;
        mintableAllow[id] = _allow;
        mintablePublic[id] = _open;
    }
    
    function getTokenData(){

    }

    function getPrice() public view returns (uint256[] memory) {
        return price;
    }

    function getMinted() public view returns (uint256[] memory) {
        return minted;
    }

    function getBurned() public view returns (uint256[] memory) {
        return burned;
    }

    function mintToken(uint256 id) public payable {
        require(mintablePublic[id] , "MINTING - ALLOW ONLY");
        require(msg.value >= price[id], "Not enough ETH sent");
        require(minted[id] <= supply[id], "Sold out");

        _mint(msg.sender, id, 1, '');

        if( (minted[id] + 1) % 5 == 0 ) {
            price[id] += increment[id];
        }
        minted[id] += 1;

        if( mintPassIncluded[id]) {
            _mint(msg.sender, 1, 1, '');
        }
        emit GMMinted(msg.sender, id);
    }

    function mintTokenAllow(uint256 id) public payable {
        require(mintableAllow[id] , "MINTING - NOT OPEN");
        require(msg.value >= price[id], "Not enough ETH sent");
        require(minted[id] <= supply[id], "Sold out");
        require(allowList[msg.sender] >= 1, "USED/NO ALLOW LIST ALLOCATION");

        _mint(msg.sender, id, 1, '');
        allowList[msg.sender] -= 1;

        if( (minted[id] + 1) % 5 == 0 ) {
            price[id] += increment[id];
        }
        minted[id] += 1;

        if( mintPassIncluded[id]) {
            _mint(msg.sender, 1, 1, '');
        }
        emit GMMinted(msg.sender, id);
    }
    
    function mintAdmin(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, '');
        minted[id] += amount;
    }

    function burnToken(address user, uint256 id) public {
        burn(user, id, 1);
        burned[id] += 1;
        emit GmBurned(user, id);
    }

    function withdraw() public onlyOwner() {
        uint256 balance = address(this).balance;
        (bool success, ) = (msg.sender).call{ value: balance }("");
        require(success, "Failed to widthdraw Ether");
    }
}