import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'
import { use } from 'react'

const Product = ({ item, provider, account, dappazon, togglePop }) => {

  const [order, setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)

  const fetchOrder = async () => {
    try {
      const events = await dappazon.queryFilter('Buy')  
      const orders = events.filter(event => event.args.buyer === account && event.args.id.toString() === item.id.toString())

      if (orders.length === 0) return

      const order = await dappazon.orders(account, orders[0].args.orderId)
      setOrder(order)

    } catch (error) {
      console.error("Error fetching order:", error)
    }

    //OR
    // Get the total order count for the user
      // const orderCount = await dappazon.orderCount(account)
      
      // if (orderCount === 0) return

      // // Loop through all user's orders to find the most recent one for this item
      // let lastOrder = null
      // for (let i = 1; i <= orderCount; i++) {
      //   const order = await dappazon.orders(account, i)
      //   // Check if this order is for the current item
      //   if (order.item && order.item.id.toString() === item.id.toString()) {
      //     lastOrder = order
      //   }
      // }

      // if (lastOrder) {
      //   setOrder(lastOrder)
      // }
  }

  const buyHandler = async () => {
    try {
      const signer = provider.getSigner()
      
      const transaction = await dappazon.connect(signer).buyProducts(item.id, 1, { value: item.price })
      await transaction.wait()

      setHasBought(true)

    } catch (error) {
      console.error("Error buying product:", error)
    } 
  }

  useEffect(() => {
    if (account && item.id) {
      fetchOrder()
    }
  }, [account, item.id, hasBought])


  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.price.toString(), 'ether')} ETH</h2>
          <hr/>
          <h2>Overview</h2>
          <p>{item.description}

            lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. 

          </p>
          
        </div>

        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.price.toString(), 'ether')} ETH</h1>
          <p>
            FREE delivery
            <br />
            <strong>{new Date(Date.now() + 345600000).toLocaleDateString( undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</strong>
          </p>

          {item.stock > 0 ? (
            <p style={{ color: 'green' }}>In Stock</p>
          ) : (
            <p style={{ color: 'red' }}>Out of Stock</p>
          )}

          <button className="product__buy" onClick={buyHandler}>Buy Now</button>

          <p><small>Shipping from</small> Dappazon</p>
          <p><small>Sold by</small> Dappazon</p>

          {
            order && (
              <div className="product__bought">
                Item bought on 
                <br/>
                <strong>
                {new Date(order.timestamp.toNumber() * 1000).toLocaleDateString( 
                  undefined, {
                    weekday: 'long', 
                    hour: 'numeric', 
                    minute: 'numeric', 
                    second: 'numeric'})}
                </strong>
                </div>
                )
          }

        </div>
          
          <button className="product__close" onClick={togglePop}>
            <img src={close} alt="Close" />
          </button>
      </div>
    </div >
  );
}

export default Product;