import { Link } from 'react-router-dom'
import { FaTruck, FaUndo, FaCreditCard, FaShieldAlt } from 'react-icons/fa'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Designers Vault</h1>
        <p>Discover premium clothing for men, women, and kids</p>
        <Link to="/products" className="cta-button">Shop Now</Link>
      </div>
      <div className="features">
        <div className="feature">
          <FaTruck className="feature-icon" />
          <h3>Free Shipping</h3>
          <p>On orders over ₦50,000</p>
        </div>
        <div className="feature">
          <FaCreditCard className="feature-icon" />
          <h3>Secure Payments</h3>
          <p>Card & bank transfer accepted</p>
        </div>
        <div className="feature">
          <FaShieldAlt className="feature-icon" />
          <h3>Quality Guarantee</h3>
          <p>100% authentic products</p>
        </div>
      </div>
    </div>
  )
}

export default Home