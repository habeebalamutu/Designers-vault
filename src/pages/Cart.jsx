import { useCart } from '../contexts/CartContext'
import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa'
import '../styles/Cart.css'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
const navigate = useNavigate()
  const getEstimatedDelivery = () => {
  const today = new Date()
  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + 5) // 5 business days
  return deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
  if (cartItems.length === 0) {
   return (
  <div className="cart-empty fade-in">
    <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
    <FaShoppingBag className="empty-icon" />
    <h2>Your cart is empty</h2>
    <p>Looks like you haven't added any products yet.</p>
    <Link to="/products" className="shop-now-btn">Shop Now</Link>
  </div>
)
  }

  return (
    <div className="cart-page fade-in">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₦{item.price.toLocaleString()}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₦{getCartTotal().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>₦15,000</span>
          </div>
          <div className="summary-row">
  <span>Estimated Delivery:</span>
  <span>{getEstimatedDelivery()}</span>
</div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₦{(getCartTotal() + 10).toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  )
}

export default Cart