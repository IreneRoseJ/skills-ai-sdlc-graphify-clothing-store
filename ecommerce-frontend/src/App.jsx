import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { restoreAuth } from './store/authSlice'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetails from './pages/ProductDetails'

function App() {
  const dispatch = useDispatch();

  // Restore authentication state from localStorage on app initialization
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('user');
    
    if (token && userDetails) {
      try { 
        const user = JSON.parse(userDetails);
        dispatch(restoreAuth({ user, token }));
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mens" element={<Home />} />
      <Route path="/womens" element={<Home />} />
      <Route path="/kids" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
    </Routes>
  )
}

export default App

