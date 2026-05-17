import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa'
import Toast from '../components/Toast'
import '../styles/Cart.css'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [toast, setToast] = useState(null)

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    removeFromCart(itemToDelete.id)
    setToast({ message: `${itemToDelete.name} removed from cart`, type: 'success' })
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const getEstimatedDelivery = () => {
    const today = new Date()
    const deliveryDate = new Date(today)
    deliveryDate.setDate(today.getDate() + 5)
    return deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page fade-in">
        <div className="cart-empty-content">
          <button className="back-button empty-back-btn" onClick={() => navigate('/products')}>
            ← Back to Shop
          </button>
          <FaShoppingBag className="empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      </div>
    )
  }

  // Non-empty cart view
  return (
    <div className="cart-page fade-in">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                <p className="cart-item-price">₦{item.price.toLocaleString()}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><FaMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><FaPlus /></button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => handleDeleteClick(item)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal:</span><span>₦{getCartTotal().toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping:</span><span>₦10.00</span></div>
          <div className="summary-row"><span>Estimated Delivery:</span><span>{getEstimatedDelivery()}</span></div>
          <div className="summary-row total"><span>Total:</span><span>₦{(getCartTotal() + 10).toLocaleString()}</span></div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Remove Item</h3>
            <p>Are you sure you want to remove <strong>{itemToDelete?.name}</strong> from your cart?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={confirmDelete} className="confirm-btn">Remove</button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Cart