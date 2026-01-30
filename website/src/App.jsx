import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import Download from './pages/Download';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Contact from './pages/Contact';
import ContactSuccess from './pages/ContactSuccess';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SecurityCompliance from './pages/SecurityCompliance';
import CookiePolicy from './pages/CookiePolicy';
import Faq from './pages/Faq';
import Pricing from './pages/Pricing';
import MergePDFs from './pages/MergePDFs';
import ForLenders from './pages/ForLenders';
import { useAuth } from './AuthContext';

function App() {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // Need this for logout redirect

    // Wrapper for logout to handle redirect
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    return (
        <div className="app">
            <nav className="navbar">
                <div className="container flex justify-between items-center">
                    <Link to="/" className="nav-brand">
                        <img src="/images/logo.png" alt="GigProof" className="logo-mark" />
                        GigProof
                    </Link>
                    <div className="flex items-center">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <a href="#" onClick={handleLogout} className="btn btn-outline" style={{ border: 'none', background: 'transparent', color: '#6b7280' }}>
                                    Logout
                                </a>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkout/:reportId" element={<Checkout />} />
                <Route path="/download" element={<Download />} />
                <Route path="/download/:reportId" element={<Download />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact-success" element={<ContactSuccess />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/security" element={<SecurityCompliance />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/merge" element={<MergePDFs />} />
                <Route path="/for-lenders" element={<ForLenders />} />
            </Routes>

            <footer style={{
                background: '#0f766e',
                color: 'var(--gray-300)',
                padding: '4rem 0 2rem',
                marginTop: '6rem'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '3rem',
                        marginBottom: '3rem'
                    }}>
                        {/* Brand */}
                        <div>
                            <Link to="/" style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                textDecoration: 'none',
                                display: 'block',
                                marginBottom: '1rem'
                            }}>
                                GigProof
                            </Link>
                            <p style={{ color: 'white', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                Professional income verification for gig workers. Generate reports instantly, securely, and privately.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h3 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                Product
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Login
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/pricing" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Pricing
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/faq" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        FAQ
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/for-lenders" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        For Lenders
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <a href="/blog/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                Legal
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/terms" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Terms of Service
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/cookies" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Cookie Policy
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/security" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Security
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                                Support
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.75rem' }}>
                                    <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{
                        paddingTop: '2rem',
                        borderTop: '1px solid var(--gray-800)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'white', fontSize: '0.875rem', margin: 0 }}>
                            © {new Date().getFullYear()} GigProof. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [pathname]);

    return null;
}

// Wrap Router outside to allow useNavigate in App
function AppWrapper() {
    return (
        <Router>
            <ScrollToTop />
            <App />
        </Router>
    );
}

export default AppWrapper;
