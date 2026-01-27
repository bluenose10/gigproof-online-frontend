import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

export default function CookiePolicy() {
    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '900px' }}>

                <div className="page-hero">
                    <div className="page-pill">
                        <Cookie size={16} />
                        Cookie Policy
                    </div>
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Cookie Policy</h1>
                    <p className="page-subtitle">How we use cookies to improve your experience.</p>
                    <div className="page-meta">Last updated: January 22, 2026</div>
                </div>

                <div className="card card-soft mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What Are Cookies?</h2>
                    <p style={{ marginBottom: 0 }}>
                        Cookies are small text files that are placed on your device when you visit a website. They help the website remember your preferences and improve your experience.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>How We Use Cookies</h2>

                    <div className="info-grid" style={{ gap: '1.5rem' }}>
                        <div className="info-tile" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Essential Cookies</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--gray-700)' }}>
                                Required for the platform to function correctly. These cannot be disabled.
                            </p>
                            <ul style={{ marginLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                <li>Authentication and session management</li>
                                <li>Security and fraud prevention</li>
                                <li>Load balancing</li>
                            </ul>
                        </div>

                        <div className="info-tile" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Analytics Cookies</h3>
                            <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--gray-700)' }}>
                                Help us understand how our service is used and improve performance.
                            </p>
                            <ul style={{ marginLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                                <li>Google Analytics (anonymized)</li>
                                <li>Page view tracking</li>
                                <li>Error monitoring</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="card card-accent mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Managing Your Cookie Preferences</h2>
                    <p style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>
                        You can control cookie preferences through your browser settings. Most browsers allow you to:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li>View and delete cookies</li>
                        <li>Block third-party cookies</li>
                        <li>Block cookies from specific sites</li>
                        <li>Block all cookies (may affect functionality)</li>
                    </ul>
                    <p style={{ color: 'var(--gray-700)', fontSize: '0.95rem', marginTop: '1rem', marginBottom: 0 }}>
                        <strong>Note:</strong> Disabling essential cookies may prevent you from using certain features of GigProof.
                    </p>
                </div>

                <div className="card card-soft" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Questions About Cookies?</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        For more information about how we use cookies and protect your data, see our full <Link to="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </p>
                    <Link to="/contact" className="btn btn-primary">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
