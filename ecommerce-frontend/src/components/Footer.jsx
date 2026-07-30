import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import '../styles/Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <div className="logo-icon">
            <ShoppingCart />
          </div>
          <span className="logo-text">SHOPPER</span>
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav">
          <Link to="/company" className="footer-link">Company</Link>
          <Link to="/products" className="footer-link">Products</Link>
          <Link to="/offices" className="footer-link">Offices</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </nav>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12c0-3.3 2.7-6 6-6 1.7 0 3 .7 3 2 0 1.3-1 2-1 2s1 .7 1 2c0 2.2-2 4-4 4-1 0-2-.3-2-.3"></path>
            </svg>
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>Copyright @ 2026 - All Right Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
