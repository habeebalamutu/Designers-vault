import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa'
import Toast from '../components/Toast'
import { useState } from 'react'
import '../styles/Wishlist.css'

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    setToast({ message: `${product.name} added to cart!`, type: 'success' })
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty fade-in">
        <button className="back-button" onClick={() => navigate('/products')}>← Back to Shop</button>
        <FaHeart className="empty-icon" />
        <h2>Your wishlist is empty</h2>
        <p>Save your favorite items here.</p>
        <Link to="/products" className="shop-now-btn">Explore Products</Link>
      </div>
    )
  }

  return (
    <div className="wishlist-page fade-in">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h1>My Wishlist</h1>
      <div className="wishlist-grid">
        {wishlist.map(product => (
          <div className="wishlist-card" key={product.id}>
            <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
            <div className="wishlist-info">
              <h3>{product.name}</h3>
              <p className="price">₦{product.price.toLocaleString()}</p>
              <div className="wishlist-buttons">
                <button onClick={() => handleAddToCart(product)} className="add-to-cart-wishlist">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(product.id)} className="remove-wishlist">
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Wishlist