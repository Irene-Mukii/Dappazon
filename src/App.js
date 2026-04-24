import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'
import { use } from 'react'

function App() {

  //useState is a hook that allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update that state. 
  const [account, setAccount] = useState(null)

  const [provider, setProvider] = useState(null)
  const [dappazon, setDappazon] = useState(null)

  const [electronicsItems, setElectronicsItems] = useState([])
  const [clothingItems, setClothingItems] = useState([])
  const [toysItems, setToysItems] = useState([])

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(!toggle) : setToggle(true)
  }

  const [loading, setLoading] = useState(true) 


  const initializationData = async () => {
    try {
  //connect blockchain

    // windows.ethereum is the global object injected by MetaMask or any other wallet into the browser, which allows web applications to interact with the Ethereum blockchain. It provides methods for requesting user accounts, sending transactions, and interacting with smart contracts. By using window.ethereum, developers can create decentralized applications (dApps) that can access the user's Ethereum wallet and perform blockchain operations directly from the browser.
    const provider =  new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    //fetch the newtork id... to confirm user is connected to the network (eg. 31337 for hardhat, 1 for mainnet, 5 for goerli) our contract is deployed on, if not we can ask them to switch to the correct network
    const network = await provider.getNetwork()
     console.log("NETWORK!!" + network.chainId)

    //connect to smart contracts (create js versions)
    // abi is the Application Binary Interface, which is a JSON representation of the smart contract's functions and events. This is automatically generated when we compile our smart contract and is used to interact with the contract from our JavaScript code. 
    // It allows us to interact with the smart contract from our JavaScript code by providing a way to encode function calls and decode responses. By using the ABI, we can create a JavaScript object that represents the smart contract and call its functions as if they were regular JavaScript functions.
    console.log("HERE!!" + config[network.chainId].dappazon.address)
    const dappazon = new ethers.Contract(config[network.chainId].dappazon.address,
    Dappazon,
     provider)
    setDappazon(dappazon)
    console.log("Dappazon", dappazon)
     
    //load products
    const items = []
    for (let i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1)
      
      items.push(item)
    } 

    const electronicsItems = items.filter((item) => item.category === "electronics")
    const clothingItems = items.filter((item) => item.category === "clothing")
    const toysItems = items.filter((item) => item.category === "toys")

    setElectronicsItems(electronicsItems)
    setClothingItems(clothingItems)
    setToysItems(toysItems)

    console.log("electronicsItems", electronicsItems)
    console.log("clothingItems", clothingItems)
    console.log("toysItems", toysItems)

    setLoading(false)
    
  } catch (error) {
    console.error("Error initializing data:", error)
  } 
}


  //useEffect is a hook generally used to perform side effects in functional components,(runs the logic when renders or change in state ie. dependancy arrays occur) such as fetching data, directly updating the DOM, and timers. The empty array [] as the second argument means that this effect will only run once when the component is first mounted, similar to componentDidMount in class components. 
  useEffect(() => {
    initializationData()
  }, []) 



  return (
    <div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading...</h2>
        </div>
      ) : (
        <>
          <Navigation account={account} setAccount={setAccount} />
          <h2>Dappazon best sellerss!</h2>
          {electronicsItems && clothingItems && toysItems && 
            (
              <>
              <Section title={"Clothing and Jewelery"} items={clothingItems} togglePop={togglePop}></Section>
              <Section title={"Electronics and Gadgets"} items={electronicsItems} togglePop={togglePop}></Section>
              <Section title={"Toys and Gaming"} items={toysItems} togglePop={togglePop}></Section> 
              </>
            )
          }

          {toggle && (
            <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop}></Product>
          )}
        </>
      )}
    </div>
  );
}

export default App;
