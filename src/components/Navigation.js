import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {

    const connectHandler = async () => {
        
        if (account===null) {
            try {   
                const provider = window.ethereum?.providers?.find(p => p.isMetaMask) || window.ethereum
                if (!provider) {
                    console.error("MetaMask not installed")
                    return
                } 
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                const account = ethers.utils.getAddress(accounts[0])
                setAccount(account);
                console.log("Account:", account)
            } catch (error) {
                console.error("Error connecting wallet:", error)
            }  
        }
    }

    return (
        <nav>
            <div className="nav__brand">
                <h1>Dappazon</h1>
            </div>

            <input type="text" placeholder="Search" className="nav__search" />
            
            {account ? (
                <button className="nav__connect">{account.slice(0, 6) + '...'+ account.slice(38, 42)}</button>
            ) : (
                <button className="nav__connect" onClick={connectHandler}>Connect Wallet</button>
            )}

            <ul className="nav__links">
                <li><a href="#Clothing & Jewelry">Clothing & Jewelry</a></li>
                <li><a href="#Electronics & Gadgets">Electronics & Gadgets</a></li>
                <li><a href="#Toys & Gaming">Toys & Gaming</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;