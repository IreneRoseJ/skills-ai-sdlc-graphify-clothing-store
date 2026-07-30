import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/OrderSuccess.scss'
import api from '../services/axios'
import { clearCart } from '../store/cartSlice'

const OrderSuccess = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const [orderDetails, setOrderDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fulfillOrder = async () => {
            const sessionId = searchParams.get('session_id')

            if (!sessionId) {
                setError('No session ID found')
                setLoading(false)
                return
            }

            try {
                const response = await api.post('/payments/fulfill', {
                    sessionId
                })

                setOrderDetails(response.data)
                
                dispatch(clearCart())
                
                setLoading(false)
            } catch (err) {
                console.error('Error fulfilling order:', err)
                setError(err.response?.data?.message || 'Failed to process order')
                setLoading(false)
            }
        }

        fulfillOrder()
    }, [searchParams, dispatch])

    if (loading) {
        return (
            <div className="order-success-page">
                <Navbar />
                <main className="order-success-main">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Processing your order...</p>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (error) {
        return (
            <div className="order-success-page">
                <Navbar />
                <main className="order-success-main">
                    <div className="error-container">
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/')} className="home-btn">
                            Return to Home
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="order-success-page">
            <Navbar />
            
            <main className="order-success-main">
                <div className="success-container">
                    <div className="success-icon">
                        <CheckCircle size={80} />
                    </div>
                    
                    <h1>Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                    </p>

                    {orderDetails && (
                        <div className="order-details">
                            <div className="detail-item">
                                <span className="detail-label">Order ID:</span>
                                <span className="detail-value">{orderDetails._id || 'Processing...'}</span>
                            </div>
                            
                            {orderDetails.email && (
                                <div className="detail-item">
                                    <span className="detail-label">Confirmation sent to:</span>
                                    <span className="detail-value">{orderDetails.email}</span>
                                </div>
                            )}
                            
                            {orderDetails.totalPrice && (
                                <div className="detail-item">
                                    <span className="detail-label">Total Amount:</span>
                                    <span className="detail-value">${orderDetails.totalPrice.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="next-steps">
                        <div className="step">
                            <Package size={40} />
                            <h3>What's Next?</h3>
                            <p>You'll receive an email confirmation with your order details and tracking information once your package ships.</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button onClick={() => navigate('/')} className="continue-shopping-btn">
                            Continue Shopping
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}

export default OrderSuccess
