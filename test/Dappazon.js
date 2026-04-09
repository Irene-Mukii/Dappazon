const { expect } = require("chai")

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

})
