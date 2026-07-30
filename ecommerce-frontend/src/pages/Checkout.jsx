import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Plus, Trash2 } from 'lucide-react' 
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/Checkout.scss'
import api from '../services/axios'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const normalizeAddress = (address) => ({
    ...address,
    id: address.id || address._id
})

const Checkout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { items } = useSelector(state => state.cart)
    const { isAuthenticated } = useSelector(state => state.auth)
    const selectedItemsFromState = Array.isArray(location.state?.selectedItems)
        ? location.state.selectedItems
        : null
    const checkoutItems = selectedItemsFromState ?? items

    const initialFormState = {
        firstName: '',
        lastName: '',
        email: '',
        shippingAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        phoneNumber: '',
        shippingMethod: 'standard'
    }

    const [savedAddresses, setSavedAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState('new')
    const [saveNewAddress, setSaveNewAddress] = useState(false)
    const [formData, setFormData] = useState(initialFormState)
    const [isLoadingAddress, setIsLoadingAddress] = useState(true)

    const fetchSavedAddresses = async () => {
        if (!isAuthenticated) {
            setSavedAddresses([])
            setSelectedAddressId('new')
            setFormData(initialFormState)
            setIsLoadingAddress(false)
            return
        }

        try {
            const response = await api.get('/users/address')

            const processedAddresses = Array.isArray(response.data?.address)
                ? response.data.address.map(normalizeAddress)
                : []

            if (processedAddresses.length > 0) {
                const preservedSelection = processedAddresses.find(addr => addr.id === selectedAddressId)
                const defaultAddr = preservedSelection || processedAddresses[0]

                setSavedAddresses(processedAddresses)
                setSelectedAddressId(defaultAddr.id)
                setFormData(prev => ({ ...defaultAddr, shippingMethod: prev.shippingMethod }))
            } else {
                setSavedAddresses([])
                setSelectedAddressId('new')
                setFormData(prev => ({ ...initialFormState, shippingMethod: prev.shippingMethod }))
            }
        } catch (error) {
            console.error('Failed to retrieve addresses profile:', error)
            setSavedAddresses([])
            setSelectedAddressId('new')
            setFormData(prev => ({ ...initialFormState, shippingMethod: prev.shippingMethod }))
        } finally {
            setIsLoadingAddress(false)
        }
    }

    useEffect(() => {
        fetchSavedAddresses()
    }, [isAuthenticated])

    const shippingFees = {
        standard: 8.00,
        express: 18.00
    }

    const selectedShippingFee = shippingFees[formData.shippingMethod]
    const taxRate = 0.075
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const tax = subtotal * taxRate
    const total = subtotal + selectedShippingFee + tax

    const regionsByCountry = {
        India: [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
            'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
            'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
            'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
        ]
    }

    const handleAddressSelect = (id) => {
        setSelectedAddressId(id)
        if (id === 'new') {
            setFormData({ ...initialFormState, shippingMethod: formData.shippingMethod })
        } else {
            const address = savedAddresses.find(addr => addr.id === id)
            if (address) {
                setFormData({ ...address, shippingMethod: formData.shippingMethod })
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleShippingMethodChange = (method) => {
        setFormData(prev => ({ ...prev, shippingMethod: method }))
    }

    const handleDeleteAddress = async (e, id) => {
        e.stopPropagation()
        
        try {
            await api.delete(`/users/address/${id}`)
            
            if (selectedAddressId === id) {
                setSelectedAddressId('new')
                setFormData(initialFormState)
            }
            
            await fetchSavedAddresses()
        } catch (error) {
            console.error("Failed to delete address:", error)
        }
    }

    const handleProceedToPayment = async (e) => {
        e.preventDefault()

        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        try {
            if (selectedAddressId === 'new' && saveNewAddress && savedAddresses.length < 3) {
                const { shippingMethod, id, ...addressPayload } = formData
                await api.post('/users/address', addressPayload)
                await fetchSavedAddresses()
            }

            const response = await api.post('/payments/create-checkout-session', {
                items: checkoutItems,
                shippingDetails: formData,
                orderSummary: {
                    subtotal,
                    tax,
                    shipping: selectedShippingFee,
                    total
                }
            })

            const { sessionId, url } = response.data
            const stripe = await stripePromise
            if (!stripe) return

            if (url) {
                window.location.href = url
            } else {
                const result = await stripe.redirectToCheckout({ sessionId })
                if (result.error) alert(result.error.message)
            }
        } catch (error) {
            console.error("Checkout process encountered an error:", error)
        }
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="checkout-page">
                <Navbar />
                <main className="checkout-main">
                    <div className="empty-checkout">
                        <h2>Your cart is empty</h2>
                        <p>Add some products before checking out!</p>
                        <button onClick={() => navigate('/')} className="continue-shopping-btn">
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="checkout-page">
            <Navbar />

            <main className="checkout-main">
                <h1 className="checkout-title">CHECKOUT</h1>

                <div className="checkout-content">
                    <div className="shipping-section">
                        {!isLoadingAddress && savedAddresses.length > 0 && (
                            <div className="saved-addresses-wrapper">
                                <h2>Select Delivery Address</h2>
                                <div className="saved-addresses-grid">
                                    {savedAddresses.map((addr) => (
                                        <div 
                                            key={addr.id} 
                                            className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`}
                                            onClick={() => handleAddressSelect(addr.id)}
                                        >
                                            <div className="card-header">
                                                <span className="name">{addr.firstName} {addr.lastName}</span>
                                                <div className="card-actions">
                                                    <button 
                                                        type="button" 
                                                        className="delete-address-btn"
                                                        onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                        title="Delete Address"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="address-text">{addr.shippingAddress}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                                            <p className="phone-text">Phone: {addr.phoneNumber}</p>
                                        </div>
                                    ))}
                                    
                                    {savedAddresses.length < 4 && (
                                        <div 
                                            className={`address-card add-new-card ${selectedAddressId === 'new' ? 'active' : ''}`}
                                            onClick={() => handleAddressSelect('new')}
                                        >
                                            <Plus size={24} />
                                            <span>Use a new address</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <h2>{selectedAddressId === 'new' ? 'Add New Shipping Information' : 'Shipping Information'}</h2>

                        <form id="checkout-form" onSubmit={handleProceedToPayment}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={selectedAddressId !== 'new'}
                                        minLength={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        disabled={selectedAddressId !== 'new'}
                                        minLength={3}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address <span className="required-star" aria-hidden="true">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={selectedAddressId !== 'new'}
                                />
                            </div>

                            <div className="form-group">
                                <label>Shipping Address <span className="required-star" aria-hidden="true">*</span></label>
                                <input
                                    type="text"
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    required
                                    disabled={selectedAddressId !== 'new'}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        disabled={selectedAddressId !== 'new'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ZIP/Postal Code <span className="required-star" aria-hidden="true">*</span></label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        required
                                        disabled={selectedAddressId !== 'new'}
                                        pattern="[0-9a-zA-Z]{5,10}"
                                        title="Please enter a valid postal code (5 to 10 alphanumeric characters)"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country <span className="required-star" aria-hidden="true">*</span></label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        disabled={selectedAddressId !== 'new'}
                                    >
                                        <option value="India">India</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>State <span className="required-star" aria-hidden="true">*</span></label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                        disabled={selectedAddressId !== 'new'}
                                    >
                                        <option value="">Select State</option>
                                        {regionsByCountry[formData.country].map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Phone Number <span className="required-star" aria-hidden="true">*</span></label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    disabled={selectedAddressId !== 'new'}
                                    pattern="[0-9]{7,15}"
                                    title="Please enter a valid phone number containing 7 to 15 digits without spaces."
                                />
                            </div>

                            {selectedAddressId === 'new' && savedAddresses.length < 3 && (
                                <div className="checkbox-group save-address-checkbox">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                        />
                                        <span>Save this address</span>
                                    </label>
                                </div>
                            )}

                            {savedAddresses.length >= 3 && (
                                <p className="address-limit-info">
                                    Try deleting any of the saved address to save a new address.
                                </p>
                            )}

                            <div className="shipping-method">
                                <h3>Shipping Method</h3>
                                <div className="shipping-options">
                                    <label className="shipping-option">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="standard"
                                            checked={formData.shippingMethod === 'standard'}
                                            onChange={() => handleShippingMethodChange('standard')}
                                        />
                                        <span>Standard (3-5 days) - $8.00</span>
                                    </label>
                                    <label className="shipping-option">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="express"
                                            checked={formData.shippingMethod === 'express'}
                                            onChange={() => handleShippingMethodChange('express')}
                                        />
                                        <span>Express (1-2 days) - $18.00</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-header">
                            <span>Products</span>
                            <span>Price</span>
                        </div>

                        <div className="products-list">
                            {checkoutItems.map((item, index) => (
                                <div key={`${item.product}-${item.size}`} className="summary-product">
                                    <div className="product-info">
                                        <span className="product-number">{index + 1}.</span>
                                        <img src={item.image} alt={item.name} className="product-image" />
                                        <div className="product-details">
                                            <p className="product-name">{item.name}</p>
                                            <p className="product-qty">Qty: {item.qty}</p>
                                            {item.qty > 1 && (
                                                <p className="product-unit-price">${item.price} each</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="product-price">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="total-items">
                                Total Items: {checkoutItems.reduce((acc, item) => acc + item.qty, 0)}
                            </div>

                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="total-row">
                                <span>Shipping:</span>
                                <span>${selectedShippingFee.toFixed(2)} ({formData.shippingMethod === 'standard' ? 'Standard' : 'Express'})</span>
                            </div>

                            <div className="total-row">
                                <span>{`Tax ${formData.country === 'UAE' ? '(VAT)' : '(GST)'}:`}</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>

                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className="payment-btn"
                            form='checkout-form'
                        >
                            <Lock size={18} />
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Checkout
