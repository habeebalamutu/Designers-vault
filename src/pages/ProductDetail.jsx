import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { mockProducts } from '../utils/mockProducts'
import { useCart } from '../contexts/CartContext'
import Toast from '../components/Toast'
import { FaTimes, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa'
import '../styles/ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()
  const [toast, setToast] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [mainImage, setMainImage] = useState('')
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Reviews collapse state
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const reviewsRef = useRef(null)

  // Review form state
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewerName, setReviewerName] = useState('')

  // Load product with localStorage reviews persistence
  useEffect(() => {
    const found = mockProducts.find(p => p.id === parseInt(id))
    if (found) {
      // Load stored reviews for this product (if any)
      const storedReviews = localStorage.getItem(`product_reviews_${id}`)
      if (storedReviews) {
        const parsed = JSON.parse(storedReviews)
        found.reviews = parsed
        // Recalculate rating
        if (parsed.length > 0) {
          const sum = parsed.reduce((acc, r) => acc + r.rating, 0)
          found.rating = sum / parsed.length
        } else {
          found.rating = 0
        }
      }
      setProduct(found)
      setMainImage(found.images?.[0] || '')
    } else {
      setProduct(null)
    }
  }, [id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setToast({ message: 'Please select a size', type: 'error' })
      return
    }
    if (!selectedColor) {
      setToast({ message: 'Please select a color', type: 'error' })
      return
    }
    addToCart({ ...product, selectedSize, selectedColor }, 1)
    setToast({ message: `${product.name} added to cart!`, type: 'success' })
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!reviewerName.trim() || !reviewComment.trim()) {
      setToast({ message: 'Please fill all fields', type: 'error' })
      return
    }
    const newReview = {
      user: reviewerName,
      comment: reviewComment,
      rating: reviewRating
    }
    const updatedReviews = [newReview, ...product.reviews]
    const newRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
    
    const updatedProduct = {
      ...product,
      reviews: updatedReviews,
      rating: newRating
    }
    setProduct(updatedProduct)
    // Save to localStorage
    localStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(updatedReviews))
    // Also update mockProducts for related products (optional)
    const index = mockProducts.findIndex(p => p.id === product.id)
    if (index !== -1) {
      mockProducts[index].reviews = updatedReviews
      mockProducts[index].rating = newRating
    }
    setToast({ message: 'Thank you for your review!', type: 'success' })
    setReviewComment('')
    setReviewerName('')
    setReviewRating(5)
  }

  const handleToggleReviews = () => {
    setReviewsOpen(!reviewsOpen)
    if (!reviewsOpen) {
      // Scroll to reviews section after a short delay to allow DOM update
      setTimeout(() => {
        if (reviewsRef.current) {
          reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // Related products
  const relatedProducts = (() => {
    if (!product) return []
    let related = mockProducts.filter(p => p.category === product.category && p.id !== product.id)
    if (related.length === 0) related = mockProducts.filter(p => p.gender === product.gender && p.id !== product.id)
    if (related.length === 0) related = mockProducts.filter(p => p.id !== product.id)
    return related.slice(0, 3)
  })()

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }
  const closeLightbox = () => setLightboxOpen(false)
  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % product.images.length)
  }
  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  if (!product) {
    return <div className="not-found">Product not found</div>
  }

  return (
    <div className="product-detail fade-in">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-container">
        {/* Image Gallery */}
        <div className="gallery">
          <div className="main-image" onClick={() => openLightbox(0)}>
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="thumbnail-list">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} view ${idx + 1}`}
                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="info">
          <h1>{product.name}</h1>
          <p className="gender-category">{product.gender} · {product.category}</p>
          <p className="price">₦{product.price.toLocaleString()}</p>
          
          {/* Clickable rating line toggles reviews */}
          <div className="rating-large clickable" onClick={handleToggleReviews}>
            <div className="rating-stars">
              {[1,2,3,4,5].map(star => (
                <FaStar key={star} className={star <= Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
              ))}
            </div>
            <span className="rating-text">{product.rating.toFixed(1)} ({product.reviews.length} customer reviews)</span>
            <span className="toggle-arrow">{reviewsOpen ? '▲' : '▼'}</span>
          </div>

          <p className="description">{product.description}</p>

          {product.stock > 0 && product.stock < 5 && (
            <p className="low-stock-detail">⚠️ Low stock! Only {product.stock} remaining.</p>
          )}

          <div className="attributes">
            <div className="size-selector">
              <label>Size:</label>
              <div className="size-buttons">
                {product.size.map(s => (
                  <button 
                    key={s} 
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="color-selector">
              <label>Color:</label>
              <div className="color-buttons">
                {product.color.map(c => (
                  <button 
                    key={c} 
                    className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                    style={{ backgroundColor: c.toLowerCase() === 'white' ? '#f0f0f0' : c.toLowerCase() }}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>

          {/* Collapsible Reviews Section with ref */}
          <div ref={reviewsRef} className="reviews-anchor"></div>
          {reviewsOpen && (
            <div className="reviews-collapsible">
              {/* Existing reviews */}
              <div className="reviews-list">
                {product.reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                  product.reviews.map((review, idx) => (
                    <div key={idx} className="review">
                      <div className="review-header">
                        <strong>{review.user}</strong>
                        <div className="review-stars">
                          {[1,2,3,4,5].map(star => (
                            <FaStar key={star} className={star <= review.rating ? 'star-filled' : 'star-empty'} />
                          ))}
                        </div>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Write a Review Form */}
              <div className="write-review-section">
                <h4>Write a Review</h4>
                <form className="review-form" onSubmit={handleSubmitReview}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                  />
                  <div className="rating-input">
                    <label>Rating: </label>
                    <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                      <option value={5}>5 ★★★★★</option>
                      <option value={4}>4 ★★★★☆</option>
                      <option value={3}>3 ★★★☆☆</option>
                      <option value={2}>2 ★★☆☆☆</option>
                      <option value={1}>1 ★☆☆☆☆</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Write your review here..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows="3"
                    required
                  ></textarea>
                  <div className="form-buttons">
                    <button type="submit" className="submit-review">Submit Review</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products">
              <h3>You May Also Like</h3>
              <div className="related-grid">
                {relatedProducts.map(rel => (
                  <div 
                    key={rel.id} 
                    className="related-card" 
                    onClick={() => window.location.href = `/product/${rel.id}`}
                  >
                    <img src={rel.images[0]} alt={rel.name} />
                    <p>{rel.name}</p>
                    <span>₦{rel.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}><FaTimes /></button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}><FaChevronLeft /></button>
          <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
            <img src={product.images[lightboxIndex]} alt={product.name} />
          </div>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}><FaChevronRight /></button>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default ProductDetail