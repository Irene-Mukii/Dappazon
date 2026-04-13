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
  const [loading, setLoading] = useState(true) 


  const loadBlockchainData = async () => {
  try {
    // // Force MetaMask if available
    // const provider = window.ethereum?.providers?.find(p => p.isMetaMask) || window.ethereum
    // if (!provider) {
    //   console.error("MetaMask not installed")
    //   return
    // }
      
    // const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    // const account = ethers.utils.getAddress(accounts[0])
    // setAccount(account);
    // console.log("Account:", account)
  } 
  
  catch (error) {
    console.error("Error loading blockchain data:", error)
  }
  finally {
    setLoading(false)
  }
  }


  //useEffect is a hook generally used to perform side effects in functional components,(runs the logic when renders or change in state ie. dependancy arrays occur) such as fetching data, directly updating the DOM, and timers. The empty array [] as the second argument means that this effect will only run once when the component is first mounted, similar to componentDidMount in class components. 
  useEffect(() => {
    loadBlockchainData()
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
          <h2>Welcome to Dappazon!</h2>
          <p>Account: {account}</p>
        </>
      )}
    </div>
  );
}

export default App;
