import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Star, ChevronRight, ArrowLeft } from 'lucide-react'
import { addToCart } from '../store/cartSlice'
import api from '../services/axios'
import '../styles/ProductDetails.scss'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sizeError, setSizeError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    // Reset selections when product changes
    if (product) {
      setSelectedSize('')
    }
  }, [product])

  const handleAddToCart = async() => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (!selectedSize) {
      setSizeError('Please select a size')
      return
    }
    
    setSizeError('')
    const productId = product._id || product.id
    
    dispatch(addToCart({
      product: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      qty: 1
    }))

    try {
      await api.post('/cart', {
        product: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        qty: 1
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="loader-container">
          <p>Product not found</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    )
  }

  const availableSizes = product.size 

  return (
    <div className="product-details-page">
      <Navbar />
      
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>
              ×
            </button>
            <h2>Login Required</h2>
            <p>Please login to add items to your cart</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
              <button className="modal-btn login" onClick={() => navigate('/login', { state: { redirectToProductId: id } })}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="product-details-main">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/')}>HOME</span>
          <ChevronRight size={16} className="breadcrumb-separator" />
          <span className="breadcrumb-item active">{product.name}</span>
        </div>

        <div className="product-details-content">
          <div className="product-images">

            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating || 0)}
              </div>
              {product.numReviews !== undefined && (
                <span className="review-count">({product.numReviews})</span>
              )}
            </div>

            <div className="product-pricing">
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
              <span className="current-price">${product.price}</span>
            </div>

            <p className="product-description">{product.description}</p>

            {availableSizes.length > 0 && (
              <div className="size-selector">
                <h3 className="size-label">Select Size</h3>
                <div className="size-options">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`size-button ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedSize(size)
                        setSizeError('')
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizeError && (
              <div className="size-error-message">
                {sizeError}
              </div>
            )}

            <button className="add-to-cart-button" onClick={handleAddToCart}>
              ADD TO CART
            </button>

            {product.category && (
              <div className="product-category">
                <span className="label">Category :</span>
                <span className="value">{Array.isArray(product.category) ? product.category.join(', ') : product.category}</span>
              </div>
            )}

            {product.brand && (
              <div className="product-brand">
                <span className="label">Brand :</span>
                <span className="value">{product.brand}</span>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetails
