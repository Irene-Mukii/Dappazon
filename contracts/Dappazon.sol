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

    struct Order {
        uint256 time;
        Item item;
    }

    event List(string name, uint256 price, uint256 quantity); // an event that is emitted when a product is listed on the Dappazon. 
    event Buy(address buyer, uint256 id, uint256 quantity); // an event that is emitted when a product is purchased on the Dappazon.

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _; //represents the rest of the code in the function that uses this modifier. It is a placeholder for the function body.
    }



// a mapping that stores items (like creating our own a DB table )listed on the Dappazon. 
    mapping(uint256 => Item) public items; 

    mapping(address => uint256) public orderCount; 

    mapping(address => mapping(uint256 => Order)) public orders; // a nested mapping that stores orders made by buyers. The first mapping maps the buyer's address to another mapping, which maps the order ID to the Order struct.

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


    //*******buy products
    //payable is a built in modifier that allows contracts/funvctions to send and receive ether. It is used to indicate that a function can receive ether when it is called. When a function is marked as payable, it can accept ether as part of the transaction that calls the function. This allows users to send ether to the contract when they call the function, which can be useful for functions that involve payments or transactions.

    function buyProducts(uint256 _id, uint256 _quantity) public payable {

        //create an order.
        Item memory item = items[_id]; // retrieve the item struct from the items mapping using the item id as the key.
        Order memory order = Order(block.timestamp, item); // create an order struct with the current timestamp and the item struct retrieved from the items mapping using the item id as the key.

        require(item.stock >= _quantity, "Not enough stock"); // check if there is enough stock of the item to fulfill the order. If not, the transaction will be reverted with the message "Not enough stock".

        uint256 totalPrice = item.price * _quantity; // calculate the total price of the order by multiplying the price of the item by the quantity ordered.

        require(msg.value >= totalPrice, "Not enough ether sent"); // check if the buyer has sent enough ether to cover the total price of the order. If not, the transaction will be reverted with the message "Not enough ether sent".

        //save order to blockchain
        orderCount[msg.sender]++; // increment the order count for the buyer's address in the orderCount mapping.
        orders[msg.sender][orderCount[msg.sender]] = order; // save the order struct to the orders mapping using the buyer's address and the order count as keys.

    
        //subtract stock
        items[_id].stock -= _quantity; // update the stock of the item by subtracting the quantity ordered from the current stock.

        //emit event
        emit Buy(msg.sender, _id, _quantity); // emit the Buy event to indicate that a purchase has been made.
    }

    //withdraw funds
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance; // get the current balance of the contract using the address(this).balance property, which returns the amount of ether stored in the contract.
        require(balance > 0, "No funds to withdraw"); // check if there are any funds to withdraw. If not, the transaction will be reverted with the message "No funds to withdraw".
        payable(msg.sender).call{value: balance}(""); // transfer the entire balance of the contract to the owner's address using the transfer function. The payable modifier is used to indicate that the recipient can receive ether.
    }
}
