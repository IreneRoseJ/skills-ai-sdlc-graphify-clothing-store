import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Login.scss';
import api from '../services/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

   try {
      const response = await api.post('/users/login', {
        email,
        password
      });

      const data = response.data;

      const userData = { id: data._id, name: data.name, email: data.email };
      
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
      console.log('Login error:', err)
      const message = err.response?.data?.message || 'Connection to server failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="login-container" style={{ flex: 1 }}>
        <div className="login-card">
        <h2 className="login-title">
          Login
        </h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
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
              className="form-input"
              placeholder="Password"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        
        <p className="signup-link">
          Don't have an account?{' '}
          <Link to="/signup" state={location.state}>
            Sign up here
          </Link>
        </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
