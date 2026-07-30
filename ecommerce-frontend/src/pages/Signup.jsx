import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Signup.scss';
import api from '../services/axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Letters + numbers required; special characters allowed (optional)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 6 characters and contain both letters and numbers. Special characters are optional.');
      return;
    }

    setLoading(true);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/users', {
        name,
        email,
        password
      });

      const data = response.data;

      const userData = { id: data.id, name: data.name || name, email: data.email };
      
      dispatch(loginSuccess({ 
        user: userData, 
        token: data.token 
      }));

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));

      const redirectToProductId = location.state?.redirectToProductId;

      if (redirectToProductId) {
        navigate(`/product/${redirectToProductId}`);
      } else {
        navigate('/');
      }
      
    } catch (err) {
      console.log('Signup error:', err)
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="signup-container" style={{ flex: 1 }}>
        <div className="signup-card">
        <h2 className="signup-title">
          Sign Up
        </h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              placeholder="Your name"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Email address"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="form-input"
              placeholder="Password"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              className="form-input"
              placeholder="Confirm Password"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>
        
        <p className="login-link">
          Already have an account?{' '}
          <Link to="/login" state={location.state}>
            Login here
          </Link>
        </p>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Signup;
