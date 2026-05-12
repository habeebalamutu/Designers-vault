import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import '../styles/Checkout.css'

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [toast, setToast] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const subtotal = getCartTotal()
  const deliveryFee = deliveryMethod === 'delivery' ? 15.00 : 0
  const total = subtotal + deliveryFee

  const confirmOrder = () => {
    if (cartItems.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'error' })
      return
    }
    setShowConfirmModal(true)
  }

  const placeOrder = () => {
    console.log('Order placed:', { cartItems, paymentMethod, deliveryMethod, total })
    setOrderPlaced(true)
    clearCart()
    setShowConfirmModal(false)
    setTimeout(() => navigate('/'), 3000)
  }

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart')
    return null
  }

  if (orderPlaced) {
    return (
      <div className="order-success fade-in">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping at Designers Vault.</p>
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="checkout-page fade-in">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-form">
          <h2>Shipping Information</h2>
          <div>
            <div className="form-row">
              <input type="text" placeholder="First Name" required id="firstName" />
              <input type="text" placeholder="Last Name" required id="lastName" />
            </div>
            <input type="email" placeholder="Email Address" required id="email" />
            <input type="tel" placeholder="Phone Number" required id="phone" />
            
            {deliveryMethod === 'delivery' && (
              <>
                <input type="text" placeholder="Street Address" required id="address" />
                <div className="form-row">
                  <input type="text" placeholder="City" required id="city" />
                  <input type="text" placeholder="Postal Code" required id="zip" />
                </div>
              </>
            )}

            {deliveryMethod === 'pickup' && (
              <div className="pickup-info">
                <p>📍 Pickup from our showroom:</p>
                <p>123 Fashion Avenue, NY 10001</p>
                <p>Mon-Fri 9am-6pm</p>
              </div>
            )}

            <h2>Delivery Method</h2>
            <div className="delivery-options">
              <label className="delivery-option">
                <input type="radio" value="delivery" checked={deliveryMethod === 'delivery'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                <span>Home Delivery (+₦15,000)</span>
              </label>
              <label className="delivery-option">
                <input type="radio" value="pickup" checked={deliveryMethod === 'pickup'} onChange={(e) => setDeliveryMethod(e.target.value)} />
                <span>Free Pickup</span>
              </label>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>Credit / Debit Card</span>
              </label>
              <label className="payment-option">
                <input type="radio" value="bank" checked={paymentMethod === 'bank'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>Bank Transfer</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-details">
                <input type="text" placeholder="Card Number" />
                <div className="form-row">
                  <input type="text" placeholder="MM/YY" />
                  <input type="text" placeholder="CVC" />
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="bank-details">
                <p>Transfer to:</p>
                <p><strong>Bank:</strong> Designers Vault Business Account</p>
                <p><strong>Account:</strong> 12-3456-7890</p>
                <p><strong>Reference:</strong> Order #DV-{Date.now()}</p>
              </div>
            )}

            <button type="button" className="place-order-btn" onClick={confirmOrder}>
              Review Order • ₦{total.toFixed(2)}
            </button>
          </div>
        </div>
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div className="order-item" key={item.id}>
              <span>{item.name} x{item.quantity}</span>
              <span>₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="order-row"><span>Subtotal</span><span>₦{subtotal.toFixed(2)}</span></div>
          <div className="order-row"><span>Delivery</span><span>{deliveryMethod === 'delivery' ? '₦15000' : 'Free'}</span></div>
          <div className="order-row total"><span>Total</span><span>₦{total.toFixed(2)}</span></div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Order</h3>
            <p>Total amount: <strong>₦{total.toFixed(2)}</strong></p>
            <p>Delivery: {deliveryMethod === 'delivery' ? 'Home Delivery (+₦15000)' : 'Free Pickup'}</p>
            <div className="modal-buttons">
              <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button onClick={placeOrder} className="confirm-btn">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Checkout