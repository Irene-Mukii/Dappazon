const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether') //aids in converting to wei
}
//global constants for listing an item...
const ID = 1
const NAME = "shoes"
const CATEGORY = "clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const PRICE = tokens(10)
const RATING = 4
const STOCK = 5

describe("Dappazon", () => {

  let dappazon;
  let deployer, buyer;

  beforeEach(async () => {
    //set up accounts
    [deployer, buyer]= await ethers.getSigners();

    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
  })


  describe("Deployment", () => {
    it("sets the owner", async () => {
      const result = await dappazon.owner()
      expect(result).to.equal(deployer.address)
    })
    
  })

  describe("listing products", () => {
    let transaction;


    beforeEach(async () => {
      transaction = await dappazon.connect(deployer).listProducts(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, STOCK)
      await transaction.wait()
    })

    it("returns the correct attributes", async () => {
      const product = await dappazon.items(ID)

      expect(product.id).to.equal(ID)
      expect(product.name).to.equal(NAME)
      expect(product.category).to.equal(CATEGORY)
      expect(product.image).to.equal(IMAGE)
      expect(product.price).to.equal(PRICE)
      expect(product.rating).to.equal(RATING)
      expect(product.stock).to.equal(STOCK)
    })

    it("emits the List event", async () => {
      await expect(transaction).to.emit(dappazon, "List").withArgs(NAME, PRICE, STOCK)    
    })
  })

  describe("buying products", () => {
    let transaction;


    beforeEach(async () => {
      transaction = await dappazon.connect(deployer).listProducts(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, STOCK)
      await transaction.wait()
      transaction = await dappazon.connect(buyer).buyProducts(ID, 2, {value: PRICE.mul(2)}) //value can be present because of the payable modifier in the buyProducts function. value is the amount of ether that the buyer is sending to the contract to pay for the order. In this case, the buyer is buying 2 items, so the total price is PRICE.mul(2). The mul function is used to multiply the price of the item by the quantity ordered. 
    })

    //buy an item
    it("updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(PRICE.mul(2))
    })

    it("updates the buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("saves the order", async () => {
      const order = await dappazon.orders(buyer.address, 1) //buyer address and order count are the keys to access the order struct in the orders mapping.
      expect(order.time).to.be.greaterThan(0) //check if the time of the order is greater than 0, which means that the order has been saved to the blockchain.
      expect(order.item.name).to.equal(NAME) //check if the name of the item in the order struct is equal to the name of the item that was bought.
      expect(order.item.price).to.equal(PRICE) //check if the price of the item in the order struct is equal to the price of the item that was bought.
    })

    it("updates the stock", async () => {
      const result = await dappazon.items(ID)
      expect(result.stock).to.equal(STOCK - 2)
    })

    it("emits the Buy event", async () => {
      await expect(transaction).to.emit(dappazon, "Buy")
    })

  })

  describe("withdrawing funds", () => {
    let balanceBefore; 

    beforeEach(async () => {
      //list item 
      let transaction = await dappazon.connect(deployer).listProducts(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, STOCK)
      await transaction.wait()

      //buy item
      transaction = await dappazon.connect(buyer).buyProducts(ID, 2, {value: PRICE.mul(2)})
      await transaction.wait()

      //get owner balance before withdrawing funds
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      //withdraw funds
      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
    })

    it("updates owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore) //check if the owner's balance after withdrawing funds is greater than the owner's balance before withdrawing funds, which means that the owner has successfully withdrawn the funds from the contract.
    })

    it("updates contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      expect(result).to.equal(0)
    })

    it("prevents non-owners from withdrawing funds", async () => {
      await expect(dappazon.connect(buyer).withdraw()).to.be.revertedWith("Only the owner can call this function")
    })

    
  })
})
