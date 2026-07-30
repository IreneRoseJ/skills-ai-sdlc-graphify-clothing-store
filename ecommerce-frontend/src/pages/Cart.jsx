import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { X, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { removeFromCart, updateQuantity, setCart } from '../store/cartSlice' 
import '../styles/Cart.scss'
import api from '../services/axios'

const SELECTION_STORAGE_KEY = 'cart.selectedItemKeys'
const SELECTION_SIGNATURE_KEY = 'cart.selectionSignature'
const IS_TEST = import.meta.env.MODE === 'test'

let transientSelectionCache = {
  signature: null,
  keys: [],
}

const getItemKey = (item) => `${item.product}-${item.size || ''}`

const areArraysEqual = (a, b) => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

const readStoredSelection = () => {
  if (IS_TEST) {
    return Array.isArray(transientSelectionCache.keys) ? transientSelectionCache.keys : []
  }

  try {
    const raw = localStorage.getItem(SELECTION_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const Cart = () => {
  const [editingItem, setEditingItem] = useState(null) 
  const [tempQuantities, setTempQuantities] = useState({}) 
  const [selectedItemKeys, setSelectedItemKeys] = useState(() => readStoredSelection())
  const [checkoutError, setCheckoutError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { isAuthenticated } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)

  const itemKeys = items.map(getItemKey)
  const itemSignature = JSON.stringify(itemKeys)
  const selectedItems = items.filter(item => selectedItemKeys.includes(getItemKey(item)))
  const selectedSubtotal = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0)

  const shippingFee = 0 
  const total = selectedSubtotal + shippingFee

  useEffect(() => {
    const signature = itemSignature

    if (IS_TEST) {
      setSelectedItemKeys((previousSelection) => {
        let nextSelection = [...itemKeys]

        if (transientSelectionCache.signature === signature) {
          const filteredKeys = transientSelectionCache.keys.filter((key) => itemKeys.includes(key))
          nextSelection = filteredKeys.length > 0 || itemKeys.length === 0 ? filteredKeys : [...itemKeys]
        }

        if (areArraysEqual(nextSelection, previousSelection)) {
          return previousSelection
        }

        return nextSelection
      })

      return
    }

    const storedSignature = localStorage.getItem(SELECTION_SIGNATURE_KEY)

    setSelectedItemKeys((previousSelection) => {
      let nextSelection

      if (storedSignature !== signature) {
        nextSelection = [...itemKeys]
      } else {
        nextSelection = previousSelection.filter((key) => itemKeys.includes(key))

        if (nextSelection.length === 0 && itemKeys.length > 0) {
          nextSelection = [...itemKeys]
        }
      }

      if (areArraysEqual(nextSelection, previousSelection)) {
        return previousSelection
      }

      return nextSelection
    })

    localStorage.setItem(SELECTION_SIGNATURE_KEY, signature)
  }, [items, itemSignature])

  useEffect(() => {
    if (IS_TEST) {
      return
    }

    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(selectedItemKeys))
  }, [selectedItemKeys, itemSignature])

  useEffect(() => {
    if (!IS_TEST) {
      return
    }

    return () => {
      transientSelectionCache = {
        signature: itemSignature,
        keys: selectedItemKeys,
      }

      queueMicrotask(() => {
        transientSelectionCache = {
          signature: null,
          keys: [],
        }
      })
    }
  }, [itemSignature, selectedItemKeys])

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/cart')
          console.log('Fetched cart items:', response.data)
          
          // Backend returns: { cartItems, itemsPrice, shippingPrice, totalPrice }
          const cartItems = response.data.cartItems || []
          const totalAmount = response.data.itemsPrice || 0
          const totalQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0)

          const dbCartData = {
            items: cartItems,
            totalAmount: totalAmount,
            totalQuantity: totalQuantity
          }

          dispatch(setCart(dbCartData))
        } catch (error) {
          console.error('Failed to fetch cart:', error)
        }
      }
    };

    fetchCart()
  }, [isAuthenticated, dispatch])

  const handleRemoveItem = async (product, size) => {
    const removedKey = `${product}-${size || ''}`

    setSelectedItemKeys((previousSelection) => previousSelection.filter((key) => key !== removedKey))
    dispatch(removeFromCart({ product, size }))
    
    console.log('Removing item from cart:', { product, size })
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/${product}?size=${size}`, { data: { product, size } })
      } catch (error) {
        console.error('Failed to remove item from server:', error)
      }
    }
  }

  const handleQuantityChange = async (product, size, newQuantity) => {
    if (newQuantity > 0) {
      // Storing the change temporarily and mark this item as being edited
      const itemKey = `${product}-${size}`
      setTempQuantities(prev => ({
        ...prev,
        [itemKey]: newQuantity
      }))
      setEditingItem(itemKey)
    }
  }

  const handleSaveQuantity = async (product, size) => {
    const itemKey = `${product}-${size}`
    const newQuantity = tempQuantities[itemKey]

    if (newQuantity && newQuantity > 0) {
      dispatch(updateQuantity({ product, size, qty: newQuantity }))

      if (isAuthenticated) {
        try {
          await api.patch(`/cart/${product}?size=${size}`, { qty: newQuantity })
        } catch (error) {
          console.error('Failed to update quantity on server:', error)
        }
      }
    }

    setEditingItem(null)
    setTempQuantities(prev => {
      const updated = { ...prev }
      delete updated[itemKey]
      return updated
    })
  }

  const handleCancelQuantity = (product, size) => {
    const itemKey = `${product}-${size}`
    
    setEditingItem(null)
    setTempQuantities(prev => {
      const updated = { ...prev }
      delete updated[itemKey]
      return updated
    })
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (selectedItems.length === 0) {
      setCheckoutError('Please select at least one item before proceeding to checkout.')
      return
    }

    navigate('/checkout', {
      state: {
        selectedItems,
      },
    })
  }

  const handleToggleItemSelection = (item) => {
    const itemKey = getItemKey(item)

    setCheckoutError('')
    setSelectedItemKeys((previousSelection) => {
      if (previousSelection.includes(itemKey)) {
        return previousSelection.filter((key) => key !== itemKey)
      }

      return [...previousSelection, itemKey]
    })
  }

  const isAllSelected = items.length > 0 && selectedItemKeys.length === items.length

  const handleSelectAll = () => {
    setCheckoutError('')

    if (isAllSelected) {
      setSelectedItemKeys([])
      return
    }

    setSelectedItemKeys([...itemKeys])
  }

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main">
        {!isAuthenticated && (
          <div className="auth-warning">
            <AlertCircle className="warning-icon" />
            <p>
              Please <Link to="/login">login</Link> to save your cart and proceed with checkout.
            </p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select All"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Products</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const itemKey = `${item.product}-${item.size}`
                    const isEditing = editingItem === itemKey
                    const displayQty = isEditing ? tempQuantities[itemKey] : item.qty
                    const isSelected = selectedItemKeys.includes(getItemKey(item))
                    
                    return (
                      <tr key={itemKey}>
                        <td>
                          <input
                            type="checkbox"
                            aria-label={`Select ${item.name}`}
                            checked={isSelected}
                            onChange={() => handleToggleItemSelection(item)}
                          />
                        </td>
                        <td>
                          <div className="product-image-cell">
                            <img src={item.image} alt={item.name} />
                          </div>
                        </td>
                        <td>
                          <div className="product-title">
                            {item.name}
                            {item.size && (
                              <span className="product-size">Size: {item.size}</span>
                            )}
                          </div>
                        </td>
                        <td className="price-cell">$ {item.price}</td>
                        <td>
                          <div className="quantity-control-wrapper">
                            <input
                              type="number"
                              min="1"
                              value={displayQty}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product,
                                  item.size,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="quantity-input"
                            />
                            {isEditing && (
                              <div className="quantity-actions">
                                <button
                                  className="save-btn"
                                  onClick={() => handleSaveQuantity(item.product, item.size)}
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  className="cancel-btn"
                                  onClick={() => handleCancelQuantity(item.product, item.size)}
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="total-cell">$ {(item.price * item.qty).toFixed(2)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveItem(item.product, item.size)}
                            aria-label="Remove item"
                          >
                            <X />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-wrapper">
              <div className="cart-totals">
                <h2>Cart Totals</h2>

                <div className="totals-row">
                  <span>Subtotal</span>
                  <span className="amount">${selectedSubtotal.toFixed(2)}</span>
                </div>

                <div className="totals-row">
                  <span>Shipping Fee</span>
                  <span className="amount">{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</span>
                </div>

                <div className="totals-row total">
                  <span>Total</span>
                  <span className="amount">${total.toFixed(2)}</span>
                </div>

                {checkoutError && (
                  <p className="checkout-validation-error">{checkoutError}</p>
                )}

                <button className="checkout-btn" onClick={handleCheckout}>
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Cart
