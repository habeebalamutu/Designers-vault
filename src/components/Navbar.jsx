import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaHome, FaBox, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import '../styles/Navbar.css'
import logo from '../assets/logo.jpeg'

function Navbar() {
  const { getCartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Designers Vault" className="nav-logo-img" />
          Designers Vault
        </Link>

        {/* Desktop navigation links (including cart) */}
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FaHome /> Home
          </Link>
          <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FaBox /> Products
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FaEnvelope /> Contact
          </Link>
          {/* Cart link for desktop */}
          <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart />
            <span className="cart-count">{getCartCount()}</span>
          </Link>
        </div>

        {/* Mobile: cart icon + hamburger (always visible on mobile, hidden on desktop) */}
        <div className="mobile-actions">
          <Link to="/cart" className="mobile-cart-icon">
            <FaShoppingCart />
            <span className="cart-count">{getCartCount()}</span>
          </Link>
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar