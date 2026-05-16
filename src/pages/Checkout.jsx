import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import '../styles/Checkout.css'

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user, signup, login } = useAuth()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [toast, setToast] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Auth state for login/signup modal
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')

  const subtotal = getCartTotal()
  const deliveryFee = deliveryMethod === 'delivery' ? 15.00 : 0
  const total = subtotal + deliveryFee

  // If not logged in, show auth modal instead of checkout form
  if (!user && !orderPlaced) {
    return (
      <div className="checkout-page fade-in">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <div className="auth-required">
          <h2>Please Login or Sign Up</h2>
          <p>You need an account to complete your purchase.</p>
          <button onClick={() => setShowAuthModal(true)} className="auth-btn">Continue</button>
        </div>

        {showAuthModal && (
          <div className="modal-overlay">
            <div className="auth-modal">
              <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                if (isLogin) {
                  const success = login(authEmail, authPassword)
                  if (success) {
                    setToast({ message: 'Logged in successfully!', type: 'success' })
                    setShowAuthModal(false)
                  } else {
                    setToast({ message: 'Invalid email or password', type: 'error' })
                  }
                } else {
                  if (!authName) {
                    setToast({ message: 'Please enter your name', type: 'error' })
                    return
                  }
                  signup(authName, authEmail, authPassword)
                  setToast({ message: 'Account created! You are now logged in.', type: 'success' })
                  setShowAuthModal(false)
                }
                setAuthEmail('')
                setAuthPassword('')
                setAuthName('')
              }}>
                {!isLogin && (
                  <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} required />
                )}
                <input type="email" placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
              </form>
              <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </p>
              <button className="close-modal" onClick={() => setShowAuthModal(false)}>Cancel</button>
            </div>
          </div>
        )}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    )
  }

  // Normal checkout flow (user logged in)
  const confirmOrder = () => {
    if (cartItems.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'error' })
      return
    }
    setShowConfirmModal(true)
  }

  const placeOrder = () => {
    const newOrder = {
      id: Date.now(),
      customerName: user.name,
      customerEmail: user.email,
      items: cartItems,
      total: total,
      deliveryMethod,
      paymentMethod,
      status: 'Pending',
      date: new Date().toISOString()
    }
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('designersVaultOrders') || '[]')
    localStorage.setItem('designersVaultOrders', JSON.stringify([newOrder, ...existingOrders]))
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
        <p>Thank you, {user?.name}.</p>
        <p>Order details have been saved. Admin will review shortly.</p>
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
              <input type="text" placeholder="First Name" required id="firstName" defaultValue={user.name.split(' ')[0]} />
              <input type="text" placeholder="Last Name" required id="lastName" defaultValue={user.name.split(' ')[1] || ''} />
            </div>
            <input type="email" placeholder="Email Address" required id="email" defaultValue={user.email} />
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
                <span>Home Delivery (+₦15.00)</span>
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
              Review Order • ₦{total.toLocaleString()}
            </button>
          </div>
        </div>
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div className="order-item" key={item.id}>
              <span>{item.name} x{item.quantity}</span>
              <span>₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="order-row"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
          <div className="order-row"><span>Delivery</span><span>{deliveryMethod === 'delivery' ? '₦15.00' : 'Free'}</span></div>
          <div className="order-row total"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Order</h3>
            <p>Total amount: <strong>₦{total.toLocaleString()}</strong></p>
            <p>Delivery: {deliveryMethod === 'delivery' ? 'Home Delivery (+₦15)' : 'Free Pickup'}</p>
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