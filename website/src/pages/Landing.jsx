import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, CheckCircle, Lock, XCircle, ArrowRight, Download, Zap, FileCheck, MapPin, Linkedin } from 'lucide-react';
import { CONFIG } from '../config';

export default function Landing() {
    const [openIndex, setOpenIndex] = useState(0);
    const faqs = [
        {
            question: 'What does GigProof do?',
            answer: 'GigProof helps gig workers create a personal income summary PDF from earnings information already visible in their gig platform dashboards (like Uber or DoorDash). The PDF is designed to be clear, professional, and easy to share.'
        },
        {
            question: 'How does it work?',
            answer: 'GigProof uses a Chrome extension that reads only the information you can already see on your screen after you log into your gig platform in your own browser. We do not log in for you, access platform APIs, or connect to bank accounts.'
        },
        {
            question: 'Is this scraping or hacking my account?',
            answer: 'No. GigProof does not scrape servers, bypass security, or access private systems. The extension simply reads on-screen text from the webpage DOM, similar to how browser tools like password managers or ad blockers operate.'
        },
        {
            question: 'Do you store my income data or PDFs?',
            answer: 'No. Your income summary is generated locally in your browser. GigProof does not store your earnings data, your gig platform credentials, or your PDFs. Once downloaded, the file belongs to you.'
        },
        {
            question: 'Does GigProof review or approve my income summary?',
            answer: 'No. GigProof generates a summary based solely on what is visible on your dashboard. We do not review, verify, or approve earnings.'
        },
        {
            question: 'Is GigProof available outside the US?',
            answer: 'Yes. GigProof works anywhere a supported gig platform provides a web dashboard that can be viewed in Chrome. Availability is platform-based, not country-based.'
        }
    ];

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'GigProof',
        url: 'https://gigproof.online',
        description: 'GigProof is a Chrome extension that reads gig platform earnings from your dashboard and generates a professional income summary PDF locally.'
    };

    const homepageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'GigProof - Gig worker income summary PDFs',
        url: 'https://gigproof.online/',
        description: 'Turn your gig dashboard into a ready income summary! Try For FREE! No bank logins. Works globally with Uber and DoorDash dashboards.'
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <div className="landing">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteSchema, homepageSchema, faqSchema]) }}
            />
            {/* HERO SECTION */}
            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-copy">
                        <div className="hero-badge reveal">
                            <Shield size={14} />
                            Chrome Extension • Private • Instant
                        </div>

                        <h1 className="hero-title reveal reveal-delay-1">
                            Turn Your Gig Dashboard Into a
                            <br />
                            <span style={{ color: 'var(--primary)' }}>Shareable Income Summary.</span>
                            <br />
                            <span style={{ color: '#10b981', fontSize: '0.85em' }}>Try For Free!</span>
                        </h1>

                        <p className="hero-subtitle reveal reveal-delay-2">
                            GigProof is a Chrome extension that reads the earnings shown on your gig earnings dashboard and turns them into a downloadable PDF. 10+ gig platforms onboard.
                            <br />
                            <strong>No bank logins. No passwords shared. Get 3 free PDFs to start!</strong>
                        </p>

                        <div className="hero-cta reveal reveal-delay-3">
                            <Link to="/login" className="btn btn-primary btn-lg">
                                Get the Chrome Extension
                                <ArrowRight size={20} />
                            </Link>
                            <a href="#how-it-works" className="btn btn-outline btn-lg">
                                How It Works
                            </a>
                        </div>

                        <div className="hero-note reveal reveal-delay-4">
                            <CheckCircle size={16} />
                            Supports 10 platforms • 3 free credits • Pay per report
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="card hero-card reveal reveal-delay-2">
                            <div className="hero-card-header">
                                <span className="extension-pill">Chrome Extension</span>
                                <span className="hero-pill">Live from dashboard</span>
                            </div>
                            <h3>Install once. Export anytime.</h3>
                            <p>
                                GigProof reads the earnings visible on your dashboard and creates a
                                Personal Income Summary PDF on your device.
                            </p>
                            <div className="mini-steps">
                                <div className="mini-step">
                                    <span>1</span> Add extension
                                </div>
                                <div className="mini-step">
                                    <span>2</span> Open dashboard
                                </div>
                                <div className="mini-step">
                                    <span>3</span> Extract totals
                                </div>
                                <div className="mini-step">
                                    <span>4</span> Download PDF
                                </div>
                            </div>
                        </div>
                        <div className="card hero-trust reveal reveal-delay-3">
                            <div className="trust-item">
                                <Lock size={18} />
                                No bank access or credentials stored
                            </div>
                            <div className="trust-item">
                                <FileCheck size={18} />
                                Clean, compliant income summary format
                            </div>
                            <div className="trust-item">
                                <Globe size={18} />
                                Works wherever platform dashboards exist
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON SECTION */}
            <section className="comparison section">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>Why is it so hard to prove you make money?</h2>
                    <p className="text-lg">We fixed the broken process of proving gig income.</p>
                    </div>

                    <div className="comparison-grid">
                        {/* Old Way */}
                        <div className="comparison-card old-way card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 style={{ color: '#991b1b', marginBottom: 0 }}>The "Old Way" 😩</h3>
                                <XCircle color="#ef4444" size={32} />
                            </div>

                            <ul className="check-list">
                                <li>
                                    <XCircle size={18} color="#ef4444" className="icon" />
                                    <span style={{ color: '#7f1d1d' }}><strong>Screenshots Rejected:</strong> Landlords don't trust loose screenshots</span>
                                </li>
                                <li>
                                    <XCircle size={18} color="#ef4444" className="icon" />
                                    <span style={{ color: '#7f1d1d' }}><strong>Privacy Risks:</strong> Sharing bank passwords to prove income</span>
                                </li>
                                <li>
                                    <XCircle size={18} color="#ef4444" className="icon" />
                                    <span style={{ color: '#7f1d1d' }}><strong>Slow Process:</strong> Waiting days for manual verification</span>
                                </li>
                            </ul>
                        </div>

                        {/* GigProof Way */}
                        <div className="comparison-card new-way card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 style={{ color: 'var(--primary-dark)', marginBottom: 0 }}>The GigProof Way ✨</h3>
                                <CheckCircle color="var(--primary)" size={32} />
                            </div>

                            <ul className="check-list">
                                <li>
                                    <CheckCircle size={18} color="var(--primary)" className="icon" />
                                    <span style={{ color: 'var(--gray-800)' }}><strong>Professional PDF:</strong> Clean, formatted summaries that look professional</span>
                                </li>
                                <li>
                                    <CheckCircle size={18} color="var(--primary)" className="icon" />
                                    <span style={{ color: 'var(--gray-800)' }}><strong>100% Private:</strong> Never see your password. Happens on your device</span>
                                </li>
                                <li>
                                    <CheckCircle size={18} color="var(--primary)" className="icon" />
                                    <span style={{ color: 'var(--gray-800)' }}><strong>Global & Instant:</strong> Works in US, UK, EU immediately</span>
                                </li>
                            </ul>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
                                <Link to="/login" className="btn btn-primary w-full">
                                    Get Started
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="steps section">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>Get started in 4 steps</h2>
                        <p className="text-lg">Create your account first, then extract securely in minutes.</p>
                    </div>

                    <div className="steps-grid">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Create your account</h3>
                            <p>Sign up on GigProof and get 3 free credits to unlock your income summary downloads</p>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Install the extension</h3>
                            <p>Add GigProof to Chrome to read totals already shown on your dashboard</p>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Open your gig dashboard</h3>
                            <p>Visit Uber or DoorDash in a new tab and open the extension</p>
                        </div>

                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>Extract and download</h3>
                            <p>Click "Extract Earnings" to generate your PDF summary instantly</p>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '2.5rem',
                        padding: '1rem',
                        background: 'rgba(5, 150, 105, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(5, 150, 105, 0.1)',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                            Your PDF reflects exactly what's visible on your dashboard at the time of extraction.
                        </p>
                    </div>
                </div>
            </section>

            {/* SUPPORTED PLATFORMS SECTION */}
            <section className="platforms-section" style={{
                background: 'var(--bg)',
                padding: '4rem 0',
                borderTop: '1px solid var(--border)'
            }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Supported Platforms</h2>
                        <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>
                            Works seamlessly with 10+ major gig economy platforms
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '1rem',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {[
                            'Uber',
                            'DoorDash',
                            'Lyft',
                            'Grubhub',
                            'Instacart',
                            'Amazon Flex',
                            'Shipt',
                            'Gopuff',
                            'Deliveroo',
                            'Just Eat'
                        ].map((platform, index) => (
                            <div
                                key={platform}
                                className="reveal"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                                    padding: '1.5rem 1.25rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    color: '#065f46',
                                    border: '2px solid #059669',
                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(5, 150, 105, 0.35)';
                                    e.currentTarget.style.borderColor = '#047857';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.2)';
                                    e.currentTarget.style.borderColor = '#059669';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)';
                                }}
                            >
                                {platform}
                            </div>
                        ))}
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '2.5rem',
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.05), rgba(16, 185, 129, 0.05))',
                        borderRadius: '12px',
                        border: '1px solid rgba(15, 118, 110, 0.1)'
                    }}>
                        <p style={{
                            color: 'var(--primary-dark)',
                            fontWeight: '500',
                            margin: 0
                        }}>
                            More platforms coming soon! Have a request? Let us know.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="features section">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2>Why Gig Workers Love GigProof</h2>
                    </div>

                    <div className="features-grid">
                        <div className="card feature-card">
                            <div className="feature-icon">
                                <Zap size={32} />
                            </div>
                            <h3>Extension-Powered Extraction</h3>
                            <p>Capture earnings directly from your dashboard without sending data to a server</p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon">
                                <Lock size={32} />
                            </div>
                            <h3>Bank-Level Security</h3>
                            <p>Your data never leaves your browser. No passwords stored, no backend access</p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon">
                                <Globe size={32} />
                            </div>
                            <h3>Works Wherever You Drive</h3>
                            <p>Built for global gig platforms with support for Uber and DoorDash today</p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon">
                                <FileCheck size={32} />
                            </div>
                            <h3>Professional Format</h3>
                            <p>Clean PDFs that many landlords, lenders, and agencies accept</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center mb-12">Frequently Asked Questions</h2>

                    <div className="faq-list">
                        {faqs.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <button
                                    key={item.question}
                                    type="button"
                                    className={`faq-item ${isOpen ? 'is-open' : ''}`}
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                    aria-expanded={isOpen}
                                >
                                    <div className="faq-question">
                                        <span>{item.question}</span>
                                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                                    </div>
                                    <div className="faq-answer">
                                        <p>{item.answer}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="text-center" style={{ marginTop: '2rem' }}>
                        <Link to="/faq" className="btn btn-outline">Read the full FAQ</Link>
                    </div>
                </div>
            </section>

            {/* FOUNDER SECTION - Trust & Credibility */}
            <section className="section" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="text-center mb-12">
                        <h2>Built by Someone Who Gets It</h2>
                    </div>

                    <div className="card" style={{ background: 'rgba(15, 118, 110, 0.08)', maxWidth: '720px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <img
                                src="/images/mark.jpg"
                                alt="Mark Moran"
                                style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: '0.25rem' }}>Mark Moran</h3>
                                <p style={{ marginBottom: '0.25rem', color: 'var(--primary-dark)', fontWeight: 600 }}>Founder & Architect</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-600)' }}>
                                    <MapPin size={14} />
                                    <span>Liverpool, UK</span>
                                </div>
                            </div>
                        </div>
                        <p style={{ color: 'var(--gray-700)', fontStyle: 'italic', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                            "After 20 years of being self-employed, I know the frustration of having plenty of income but zero ways to prove it for a loan or rent. I built GigProof to bridge that gap for workers like us."
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '0.75rem',
                            color: 'var(--gray-700)',
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.75rem',
                            border: '1px solid rgba(15, 118, 110, 0.15)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} color="var(--primary)" />
                                <span style={{ fontSize: '0.95rem' }}>MSc Cyber Security</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} color="var(--primary)" />
                                <span style={{ fontSize: '0.95rem' }}>BSc (Hons) Computing</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} color="var(--primary)" />
                                <span style={{ fontSize: '0.95rem' }}>Blockchain Solutions Architect</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={18} color="var(--primary)" />
                                <span style={{ fontSize: '0.95rem' }}>AI & Information Technology Expert</span>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '1.5rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid rgba(15, 118, 110, 0.15)'
                        }}>
                            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                                <strong>Your security is in expert hands.</strong> With advanced degrees in cybersecurity and decades of tech experience, GigProof is built with privacy and protection at its core.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ArrowRight size={18} />
                                    Try GigProof Free
                                </Link>
                                <a href="https://www.linkedin.com/in/mark-moran-blockchain-solutions-architect/" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Linkedin size={18} />
                                    View LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
