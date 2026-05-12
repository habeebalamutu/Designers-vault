import { useState, useEffect } from 'react'
import { mockProducts } from '../utils/mockProducts'
import { useCart } from '../contexts/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'
import '../styles/Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGender, setSelectedGender] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { addToCart } = useCart()

useEffect(() => {
  const timer = setTimeout(() => {
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setLoading(false)
  }, 1200) // increased to 1200ms to see the skeleton
  return () => clearTimeout(timer)
}, [])

  // Filter products whenever search or filters change
  useEffect(() => {
    let results = products
    if (searchTerm) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedGender !== 'All') {
      results = results.filter(p => p.gender === selectedGender)
    }
    if (selectedCategory !== 'All') {
      results = results.filter(p => p.category === selectedCategory)
    }
    setFilteredProducts(results)
  }, [searchTerm, selectedGender, selectedCategory, products])

  const handleAddToCart = (product) => {
    if (product.stock === 0) return
    addToCart(product, 1)
    setToast({ message: `${product.name} added to cart!`, type: 'success' })
  }

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <div className="products-page">
        <h1>All Products</h1>
        <div className="products-grid skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-card skeleton">
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="products-page fade-in">
      <h1>Shop Clothing</h1>
      
      {/* Search and Filters */}
      <div className="filters-bar">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="filter-select"
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="All">All Genders</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>
        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div className="product-card" key={product.id}>
<img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="category">{product.gender} · {product.category}</p>
            <p className="price">₦{product.price.toLocaleString()}</p>
            <div className="rating">
              ⭐ {product.rating} ({product.reviews.length} reviews)
            </div>
            {product.stock > 0 && product.stock < 5 && (
  <p className="low-stock">⚠️ Only {product.stock} left! Order soon.</p>
)}
            {product.stock === 0 ? (
              <p className="out-of-stock">Out of stock</p>
            ) : (
              <p className="in-stock">In stock: {product.stock}</p>
            )}
            <div className="card-buttons">
              <button 
                className="view-details-btn"
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                View Details
              </button>
              <button 
                className="add-to-cart-card-btn"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="no-results">No products found. Try different filters.</div>
      )}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}

export default Products