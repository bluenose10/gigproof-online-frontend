import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Check } from 'lucide-react';

export default function SecurityCompliance() {
    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '900px' }}>

                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '1rem' }}>Security & Compliance</h1>
                    <p className="page-subtitle">
                        Client-side processing, zero credential storage, and encrypted connections designed to keep your gig income private.
                    </p>
                </div>

                <div className="card card-accent mb-8">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Our Security Philosophy</h2>
                    <p style={{ color: 'var(--gray-700)', marginBottom: 0 }}>
                        At GigProof, we believe your income data belongs to you. Our architecture is designed around <strong>Zero-Persistence Security</strong>. We never see, store, or transmit your gig platform passwords.
                    </p>
                </div>

                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Client-Side Data Processing</h2>
                    </div>
                    <p style={{ marginBottom: '1rem' }}>
                        Unlike traditional services, GigProof processes your income data entirely in your browser:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Browser-based extraction:</strong> Our Chrome extension reads data directly from your dashboard</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Local PDF generation:</strong> Reports are created on your device, not our servers</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>No server-side storage:</strong> Your earnings data never touches our backend</li>
                        <li><strong>Zero credentials exposure:</strong> We never see your platform passwords</li>
                    </ul>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Data Protection at Rest & Transit</h2>
                    <div className="info-grid">
                        <div className="info-tile">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock size={20} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>TLS Encryption</h3>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0 }}>
                                All communication between your browser and our services is encrypted in transit.
                            </p>
                        </div>

                        <div className="info-tile">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={20} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Secure Auth Storage</h3>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0 }}>
                                Authentication data is protected with industry-standard security controls.
                            </p>
                        </div>

                        <div className="info-tile">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={20} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Minimal Data Surface</h3>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0 }}>
                                Earnings data never reaches our servers, reducing exposure risk.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card card-accent mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Check size={28} color="var(--primary-dark)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary-dark)' }}>No Credential Persistence</h2>
                    </div>
                    <p style={{ color: 'var(--gray-800)', marginBottom: '1rem' }}>
                        When you use the Chrome extension, you log into the gig platform directly in your own browser. GigProof does not receive your credentials or store them anywhere.
                    </p>
                    <p style={{ color: 'var(--gray-800)', marginBottom: 0 }}>
                        Your income data is extracted client-side and used only to generate your PDF report locally.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Privacy & Compliance Commitments</h2>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Our MVP is intentionally designed to reduce compliance scope while keeping users in control:
                    </p>
                    <div className="info-grid">
                        <div className="info-tile">
                            <strong>No credential storage</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.5rem' }}>
                                We never store your gig platform login details.
                            </p>
                        </div>

                        <div className="info-tile">
                            <strong>No income data storage</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.5rem' }}>
                                Earnings data stays in your browser only.
                            </p>
                        </div>

                        <div className="info-tile">
                            <strong>User-controlled deletion</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.5rem' }}>
                                Delete your account at any time to remove login access.
                            </p>
                        </div>

                        <div className="info-tile">
                            <strong>Transparent policies</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.5rem' }}>
                                Clear privacy, security, and terms documentation.
                            </p>
                        </div>

                        <div className="info-tile">
                            <strong>Payment security</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.5rem' }}>
                                Payments are handled by Stripe with PCI-compliant infrastructure.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card mb-8">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Do you store my earnings data?</h3>
                        <p style={{ marginBottom: 0 }}>
                            No. Earnings data stays in your browser and is never sent to our servers.
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Can you see my gig platform password?</h3>
                        <p style={{ marginBottom: 0 }}>
                            No. You log in directly on the platform. We never see or store your credentials.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>How long do you keep my account data?</h3>
                        <p style={{ marginBottom: 0 }}>
                            We keep account data only while your account is active. You can close your account at any time to remove access.
                        </p>
                    </div>
                </div>

                <div className="card card-accent" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Have More Security Questions?</h2>
                    <Link to="/contact" className="btn btn-primary">
                        Contact Our Team
                    </Link>
                </div>
            </div>
        </div>
    );
}
