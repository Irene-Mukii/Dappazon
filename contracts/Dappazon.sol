// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    //code goes here
   
    address public owner; // a state variable that stores the address of the owner of the contract.

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 price;
        uint256 rating;
        uint256 stock;
    }

    event List(string name, uint256 price, uint256 quantity); // an event that is emitted when a product is listed on the Dappazon. 
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _; //represents the rest of the code in the function that uses this modifier. It is a placeholder for the function body.
    }

    mapping(uint256 => Item) public items; // a mapping that stores the items (like creating our own a DB table )listed on the Dappazon. The key is the item id and the value is the item struct.
    constructor() {
        
        owner = msg.sender; // msg.sender is a global variable that stores the address of the person who deployed the contract.
    }
    //the account owner lists a product in the market place
    function listProducts(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _price,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner{
      
        //creat item struct 
        Item memory item = Item({
            id: _id,
            name: _name,
            category: _category,
            image: _image,
            price: _price,
            rating: _rating,
            stock: _stock
        }); 
        //save item struct to blockchain
        items[_id] = item; // save the item struct to the items mapping using the item id as the key.   

        //emit event
        emit List(_name, _price, _stock); // emit the List event 

    }
    //buy products
    //withdraw funds

}
