// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "hardhat/console.sol";

contract GMMerchStrut is ERC1155, Ownable, ERC1155Burnable {
    constructor()
        ERC1155("https://ipfs.io/ipfs/QmPDLZhhtFkNp94PYpa63A5sKPax4dog9K3So1PUjoq9pf/{id}.json")
        {}
    
    mapping(address => mapping(uint256 => bool)) public mintList;

    struct MerchItem {
        uint256 minted;
        uint256 burned;
        uint256 supply;
        uint256 price;
        uint256 increment;
        bool allowMintable;
        bool publicMintable;
        bool mintPassIncluded;
    }
    MerchItem[] public merch;

    function createMerchItem(uint256 _supply, uint256 _price, uint256 _increment) public onlyOwner{
        merch.push(MerchItem({
            minted: 0,
            burned: 0,
            supply: _supply,
            price: _price,
            increment: _increment,
            allowMintable: false,
            publicMintable: false,
            mintPassIncluded: false
        }));
    }

    function updateMerchItem(uint _index, uint256 _supply, uint256 _price, uint256 _increment, bool _allowMintable, bool _publicMintable, bool _mintPassIncluded) public {
        MerchItem storage m = merch[_index];
        m.supply = _supply;
        m.price = _price;
        m.increment = _increment;
        m.allowMintable = _allowMintable;
        m.publicMintable = _publicMintable;
        m.mintPassIncluded = _mintPassIncluded;
    }

    function getMerchCount() public view returns(uint merchCount) {
        return merch.length;
    }

    mapping(address => uint8) public allowList;

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

    function clearAllowListAddress(address _address) public  onlyOwner () {
        allowList[_address] = 0;
    }

    function mintToken(uint256 id) public payable {
        require(merch[id].publicMintable , "MINTING - ALLOW ONLY");
        require(msg.value >= merch[id].price, "Not enough ETH sent");
        require(merch[id].minted <= merch[id].supply, "Sold out");
        require(!mintList[msg.sender][id], "ONLY 1 MINT PER WALLET");

        // console.log(mintList[msg.sender][id]);
        _mint(msg.sender, id, 1, '');

        if( (merch[id].minted + 1) % 5 == 0 ) {
            merch[id].price += merch[id].increment;
        }
        merch[id].minted += 1;
        mintList[msg.sender][id] = true;

        if(merch[id].mintPassIncluded) {
            merch[1].minted += 1;
            _mint(msg.sender, 1, 1, '');
        }
        emit GMMinted(msg.sender, id);
    }

    function mintTokenAllow(uint256 id) public payable {
        require(merch[id].allowMintable , "MINTING - NOT OPEN");
        require(msg.value >= merch[id].price, "Not enough ETH sent");
        require(merch[id].minted <= merch[id].supply, "Sold out");
        require(allowList[msg.sender] >= 1, "NO ALLOW LIST ALLOCATION");
        require(!mintList[msg.sender][id], "ONLY 1 MINT PER WALLET");

        _mint(msg.sender, id, 1, '');
        
        merch[id].minted += 1;
        mintList[msg.sender][id] = true;
        allowList[msg.sender] -= 1;

        if( (merch[id].minted + 1) % 5 == 0 ) {
            merch[id].price += merch[id].increment;
        }

        if(merch[id].mintPassIncluded) {
            _mint(msg.sender, 1, 1, '');
        }
        emit GMMinted(msg.sender, id);
    }
    
    function mintAdmin(address to, uint256 id, uint256 amount) public onlyOwner {
        _mint(to, id, amount, '');
        merch[id].minted += 1;
    }

    function burnToken(address _address, uint256 id) public {
        burn(_address, id, 1);
        merch[id].burned += 1;
        emit GmBurned(_address, id);
    }

    function withdraw() public onlyOwner() {
        uint256 balance = address(this).balance;
        (bool success, ) = (msg.sender).call{ value: balance }("");
        require(success, "Failed to widthdraw Ether");
    }
}