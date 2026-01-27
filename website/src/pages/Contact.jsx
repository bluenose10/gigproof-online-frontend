import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Linkedin, Mail, MapPin, Send } from 'lucide-react';

export default function Contact() {
    const navigate = useNavigate();

    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '1200px' }}>

                {/* Header */}
                <div className="page-hero">
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background: 'rgba(16, 185, 129, 0.12)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <Mail size={30} color="var(--primary)" />
                    </div>
                    <h1 style={{ marginBottom: '1rem' }}>Get in Touch</h1>
                    <p className="page-subtitle">
                        Have questions about GigProof? We're here to help. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Contact Form */}
                    <div className="card" style={{ padding: '3rem', maxWidth: '620px', margin: '0 auto' }}>
                        <form
                            name="contact"
                            method="POST"
                            data-netlify="true"
                            data-netlify-honeypot="bot-field"
                            action="/contact-success"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);

                                fetch('/', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: new URLSearchParams(formData).toString()
                                })
                                .then(() => navigate('/contact-success'))
                                .catch((error) => alert('Error: ' + error));
                            }}
                        >
                            {/* Netlify form fields */}
                            <input type="hidden" name="form-name" value="contact" />
                            <p style={{ display: 'none' }}>
                                <label>Don't fill this out: <input name="bot-field" /></label>
                            </p>

                            <div className="form-group">
                                <label className="form-label" htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="form-input"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    className="form-input"
                                    rows="6"
                                    placeholder="Tell us how we can help..."
                                    style={{ resize: 'vertical', minHeight: '150px' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full">
                                <Send size={20} />
                                Send Message
                            </button>

                            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '1rem', marginBottom: 0 }}>
                                We typically respond within 24 hours during business days.
                            </p>
                        </form>
                    </div>

                    {/* Additional Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="card">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'rgba(16, 185, 129, 0.12)',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <Mail size={24} color="var(--primary)" />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Contact Form</h3>
                                <p style={{ color: 'var(--gray-600)', marginBottom: 0 }}>
                                    For all inquiries, please use the contact form above. We'll respond within 24 hours.
                                </p>
                            </div>

                            <div className="card">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'rgba(16, 185, 129, 0.12)',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <Linkedin size={24} color="var(--primary)" />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>LinkedIn</h3>
                                <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                                    Connect with us for updates and professional networking.
                                </p>
                                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: 'fit-content' }}>
                                    View Founder Profile <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>

                        <div className="card" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <img
                                    src="/images/mark.jpg"
                                    alt="Mark Moran"
                                    style={{ width: '72px', height: '72px', borderRadius: '20px', objectFit: 'cover' }}
                                />
                                <div>
                                    <h3 style={{ marginBottom: '0.25rem' }}>Mark Moran</h3>
                                    <p style={{ marginBottom: '0.25rem', color: 'var(--primary-dark)', fontWeight: 600 }}>Founder & Architect</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-600)' }}>
                                        <MapPin size={14} />
                                        <span>Liverpool, UK</span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: 'var(--gray-700)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                “After 20 years of being self-employed, I know the frustration of having plenty of income but zero ways to prove it for a loan or rent. I built GigProof to bridge that gap for workers like us.”
                            </p>
                            <div style={{ display: 'grid', gap: '0.5rem', color: 'var(--gray-700)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} color="var(--primary)" /> MSc Cyber Security
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} color="var(--primary)" /> BSc (Hons) Computing
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} color="var(--primary)" /> Blockchain Solutions Architect
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} color="var(--primary)" /> AI & Information Technology Expert
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '0.5rem' }}>
                        <Link
                            to="/"
                            style={{
                                display: 'inline-flex',
                                gap: '0.5rem',
                                alignItems: 'center',
                                color: 'var(--primary-dark)',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
