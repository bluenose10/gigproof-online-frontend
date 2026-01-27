import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Cookie, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '900px' }}>

                {/* Header */}
                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Privacy Policy</h1>
                    <div className="page-meta">Last updated: January 22, 2026</div>
                </div>

                {/* Introduction */}
                <div className="card card-accent mb-8">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Introduction</h2>
                    <p style={{ color: 'var(--gray-700)', marginBottom: 0 }}>
                        At GigProof, we respect your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. By using GigProof, you agree to the collection and use of information in accordance with this policy.
                    </p>
                </div>

                {/* Information We Collect */}
                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Database size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Information We Collect</h2>
                    </div>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Account Information</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        When you create an account, we collect your email address, name, and password. Your email address is used to create and manage your login.
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Income Data (Client-Side Only)</h3>
                    <p style={{ marginBottom: '0.5rem' }}>
                        GigProof reads earnings data from the visible content on your gig platform dashboard when you request an extraction. <strong>Critically:</strong>
                    </p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li>We only read content that is visible on the page at your request</li>
                        <li>All data extraction happens in your browser</li>
                        <li>No income data is sent to our servers</li>
                        <li>PDFs are generated client-side on your device</li>
                        <li>We never store your earnings information</li>
                    </ul>
                    <h3 style={{ fontSize: '1.125rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Support Communications</h3>
                    <p style={{ marginBottom: 0 }}>
                        If you contact us, we collect the information you choose to provide so we can respond to your request.
                    </p>
                </div>

                {/* How We Use Your Information */}
                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Eye size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>How We Use Your Information</h2>
                    </div>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Create personal income summary PDFs locally in your browser</li>
                        <li style={{ marginBottom: '0.5rem' }}>Provide access to your account and manage authentication</li>
                        <li style={{ marginBottom: '0.5rem' }}>Respond to support requests and user inquiries</li>
                        <li style={{ marginBottom: '0.5rem' }}>Improve our service and develop new features</li>
                        <li>Comply with legal obligations and prevent fraud</li>
                    </ul>
                </div>

                {/* Data Security */}
                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Data Security</h2>
                    </div>
                    <p style={{ marginBottom: '1rem' }}>
                        We implement industry-standard security measures to protect your data:
                    </p>
                    <div className="info-grid">
                        <div className="info-tile">
                            <strong>TLS encryption</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>All data in transit is encrypted</p>
                        </div>
                        <div className="info-tile">
                            <strong>Secure authentication</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Session tokens are protected</p>
                        </div>
                        <div className="info-tile">
                            <strong>Access controls</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Limited personnel access</p>
                        </div>
                    </div>

                    <div className="note-card" style={{ marginTop: '1.5rem' }}>
                        <p style={{ marginBottom: 0, color: 'var(--gray-800)' }}>
                            <strong>Important:</strong> We never store your gig platform credentials. You log in directly on the platform, and your income data stays in your browser.
                        </p>
                    </div>
                </div>

                {/* Data Sharing */}
                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <UserCheck size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Data Sharing and Disclosure</h2>
                    </div>
                    <p style={{ marginBottom: '1rem' }}>
                        We will not sell your personal or financial data to third parties. We only share your data in the following circumstances:
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Service Providers</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        We work with trusted third-party providers to deliver our service. These providers are contractually obligated to protect your data:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)', marginBottom: '1.5rem' }}>
                        <li>Supabase (authentication and database)</li>
                        <li>Stripe (payment processing)</li>
                    </ul>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Legal Requirements</h3>
                    <p style={{ marginBottom: '0.5rem' }}>
                        We may disclose information if required to do so by law or in response to valid requests by public authorities.
                    </p>
                </div>

                {/* Your Rights (GDPR) */}
                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Your Rights (GDPR Compliance)</h2>
                    </div>
                    <p style={{ marginBottom: '1rem' }}>
                        If you are located in the European Economic Area (EEA), you have certain data protection rights:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <strong>Right to Access</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Request a copy of your data</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <strong>Right to Rectification</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Correct any inaccurate data</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <strong>Right to Erasure</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Request deletion of your data</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <strong>Right to Restrict Processing</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Limit how we use your data</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <strong>Right to Data Portability</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Transfer your data elsewhere</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                            <strong>Right to Object</strong>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: 0, marginTop: '0.25rem' }}>Object to our processing</p>
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        To exercise these rights, please <Link to="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>contact us</Link>.
                    </p>
                </div>

                {/* Cookies and Tracking */}
                <div className="card mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Cookie size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Cookies and Tracking</h2>
                    </div>
                    <p style={{ marginBottom: '1rem' }}>
                        We use cookies and similar tracking technologies to improve your experience, analyze usage, and assist with security. You can control cookies through your browser settings. Note that this may affect some functionalities.
                    </p>
                    <Link to="/cookies" className="btn btn-outline">
                        View Cookie Policy
                    </Link>
                </div>

                {/* Data Retention */}
                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Data Retention</h2>
                    <p style={{ marginBottom: 0 }}>
                        We retain your account data for as long as your account is active or as needed to provide services. We do not retain income data or PDFs. If you delete your account, we will delete or anonymize your account data within 30 days, except where we are required by law to retain it for legal purposes.
                    </p>
                </div>

                {/* Children's Privacy */}
                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Children's Privacy</h2>
                    <p style={{ marginBottom: 0 }}>
                        Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                    </p>
                </div>

                {/* Changes to Policy */}
                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Changes to This Privacy Policy</h2>
                    <p style={{ marginBottom: 0 }}>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after changes are posted constitutes acceptance.
                    </p>
                </div>

                {/* Contact */}
                <div className="card card-accent">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Contact Us</h2>
                    <p style={{ color: 'var(--gray-700)' }}>
                        If you have questions about this Privacy Policy or our data practices, please <Link to="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>contact us</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
