import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactSuccess() {
    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '1rem' }}>Message Sent</h1>
                    <p className="page-subtitle">
                        Thanks for reaching out. We typically respond within 24 hours during business days.
                    </p>
                </div>

                <div className="card card-soft" style={{ padding: '3rem', textAlign: 'center' }}>
                    <CheckCircle size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ marginBottom: '0.75rem' }}>We got your message</h2>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                        If you have more details to add, you can send another message any time.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/contact" className="btn btn-primary">
                            Send Another Message
                        </Link>
                        <Link to="/" className="btn btn-outline">
                            Back to Home <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
