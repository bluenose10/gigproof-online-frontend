import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, Shield, Clock, Users, AlertTriangle } from 'lucide-react';

export default function ForLenders() {
    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '1000px' }}>
                {/* Hero */}
                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '0.75rem' }}>Income Summaries for Gig Workers</h1>
                    <p className="page-subtitle" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
                        A privacy-first way for lenders and dealers to review gig income using data visible on platform dashboards.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href="/Sample-PDF.pdf" target="_blank" className="btn btn-primary btn-lg">
                            <FileText size={20} />
                            View Sample Report
                        </a>
                        <Link to="/contact" className="btn btn-outline btn-lg">
                            Contact Us for Pilot Access
                        </Link>
                    </div>
                </div>

                {/* What GigProof Is */}
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>What GigProof Is</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                        GigProof generates user-authorized income summaries from earnings already visible on gig worker dashboards (Uber, DoorDash, Amazon Flex, Shipt, and more).
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={24} color="var(--primary)" />
                            <span style={{ fontWeight: 500 }}>No bank connections</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={24} color="var(--primary)" />
                            <span style={{ fontWeight: 500 }}>No Plaid</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={24} color="var(--primary)" />
                            <span style={{ fontWeight: 500 }}>No credentials shared</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '1.5rem', color: 'var(--gray-600)', marginBottom: 0 }}>
                        All reports are generated locally on the user's device and shared by the applicant.
                    </p>
                </div>

                {/* How the Report Is Created */}
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
                        How the Report Is Created
                        <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--gray-600)', marginLeft: '0.75rem' }}>(Important for compliance)</span>
                    </h2>
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        {[
                            { step: 1, text: 'Applicant logs into their gig platform directly' },
                            { step: 2, text: 'Applicant runs GigProof Chrome extension' },
                            { step: 3, text: 'Extension reads only visible earnings totals' },
                            { step: 4, text: 'PDF is generated locally and shared with lender' }
                        ].map(item => (
                            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {item.step}
                                </div>
                                <span style={{ fontSize: '1.05rem' }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        <p style={{ margin: 0, color: 'var(--gray-700)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>GigProof does not access APIs, scrape servers, store income data, or verify earnings.</span>
                        </p>
                    </div>
                </div>

                {/* What Lenders Receive */}
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>What Lenders Receive</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        {[
                            'Reporting period',
                            'Platform name',
                            'Total earnings shown',
                            'Applicant identity',
                            'Clear disclaimer & audit trail',
                            'Unique report ID'
                        ].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle size={20} color="var(--primary)" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <a href="/Sample-PDF.pdf" target="_blank" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={18} />
                            View a sample report
                        </a>
                    </div>
                </div>

                {/* What GigProof Is NOT */}
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', border: '1px solid #fecaca' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#991b1b' }}>What GigProof Is Not</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        {[
                            'Not a bank feed',
                            'Not a credit report',
                            'Not a verified income certification',
                            'Not a platform-issued statement'
                        ].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <XCircle size={20} color="#dc2626" />
                                <span style={{ color: '#7f1d1d' }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ marginTop: '1.5rem', marginBottom: 0, color: '#991b1b', fontStyle: 'italic' }}>
                        This is user-provided documentation, similar to uploaded screenshots - but structured, readable, and consistent.
                    </p>
                </div>

                {/* Why Lenders Use It */}
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Why Lenders Use It</h2>
                    <div className="info-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <Clock size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Faster Applications</h3>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>Structured data instead of messy screenshots</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <Users size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Fewer Rejected Gig Workers</h3>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>Accept applicants you'd otherwise turn away</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <FileText size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Reduced Manual Review</h3>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>No more deciphering screenshots</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <Shield size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Zero Data Custody Risk</h3>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', margin: 0 }}>We don't store financial data</p>
                        </div>
                    </div>
                </div>

                {/* Compliance Positioning */}
                <div className="card card-accent" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
                        <Shield size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Compliance Positioning
                    </h2>
                    <p style={{ marginBottom: '1rem', fontWeight: 500 }}>GigProof:</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={18} color="var(--primary)" />
                            Does not store financial data
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={18} color="var(--primary)" />
                            Does not verify income
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={18} color="var(--primary)" />
                            Does not alter platform data
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={18} color="var(--primary)" />
                            Acts only at user request
                        </li>
                    </ul>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--primary-dark)' }}>
                            Lenders retain full underwriting discretion.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Ready to Learn More?</h2>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                        Contact us to discuss pilot programs, integration options, or to request additional sample reports.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            Contact Us
                        </Link>
                        <a href="/Sample-PDF.pdf" target="_blank" className="btn btn-outline btn-lg">
                            Download Sample Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
