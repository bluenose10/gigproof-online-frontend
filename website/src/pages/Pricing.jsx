import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import { CONFIG } from '../config';
import { useAuth } from '../AuthContext';

export default function Pricing() {
    const { user, supabase } = useAuth();
    const navigate = useNavigate();
    const [processingPlan, setProcessingPlan] = useState(null);

    const startCheckout = async (planType, priceId) => {
        if (!user?.id) {
            navigate('/login?redirect=/pricing');
            return;
        }

        setProcessingPlan(planType);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;

            console.log('🔍 Calling checkout URL:', CONFIG.STRIPE_CHECKOUT_URL);
            const res = await fetch(CONFIG.STRIPE_CHECKOUT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': CONFIG.SUPABASE_PUBLISHABLE_KEY,
                    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
                },
                body: JSON.stringify({
                    priceId,
                    planType,
                    userId: user.id
                })
            });
            const body = await res.json();
            if (body.url) {
                window.location.href = body.url;
            } else {
                alert('Failed to start checkout');
            }
        } catch (e) {
            console.error(e);
            alert('Error starting checkout');
        } finally {
            setProcessingPlan(null);
        }
    };

    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '0.75rem' }}>Simple, Transparent Pricing</h1>
                    <p className="page-subtitle">
                        Choose the plan that works for you. No subscriptions, no hidden fees.
                    </p>
                </div>

                <div className="info-grid" style={{ marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    <div className="card" style={{ textAlign: 'center', paddingTop: '2rem', border: '2px solid var(--primary)', boxShadow: '0 16px 40px rgba(5, 150, 105, 0.12)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            Most Popular
                        </div>
                        <div className="page-pill" style={{ marginBottom: '1rem' }}>1 Report</div>
                        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>$2.99</h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>1 PDF credit</p>
                        {CONFIG.PAYMENTS_ENABLED ? (
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => startCheckout('single', CONFIG.STRIPE_PRICE_SINGLE)}
                                disabled={processingPlan !== null}
                            >
                                {processingPlan === 'single' ? 'Processing...' : 'Buy 1 Report'}
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-lg">
                                Join Beta
                            </Link>
                        )}
                        <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0', display: 'grid', gap: '0.75rem', textAlign: 'left' }}>
                            <li className="flex items-center gap-2"><CheckCircle size={18} color="var(--primary)" /> No watermark</li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} color="var(--primary)" /> Professional PDF format</li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} color="var(--primary)" /> Ready to share</li>
                        </ul>
                    </div>

                    <div className="card" style={{ textAlign: 'center', paddingTop: '2rem' }}>
                        <div className="page-pill" style={{ marginBottom: '1rem' }}>10 Reports</div>
                        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>$19.99</h2>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>10 PDF credits</p>
                        {CONFIG.PAYMENTS_ENABLED ? (
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => startCheckout('bundle', CONFIG.STRIPE_PRICE_BUNDLE)}
                                disabled={processingPlan !== null}
                            >
                                {processingPlan === 'bundle' ? 'Processing...' : 'Buy 10 Reports'}
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Join Beta
                            </Link>
                        )}
                        <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0', display: 'grid', gap: '0.75rem', textAlign: 'left' }}>
                            <li className="flex items-center gap-2"><CheckCircle size={18} color="var(--primary)" /> Best value per report</li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} color="var(--primary)" /> Ideal for multiple months</li>
                            <li className="flex items-center gap-2"><CheckCircle size={18} color="var(--primary)" /> Credits never expire</li>
                        </ul>
                    </div>
                </div>

                <div className="info-grid" style={{ marginBottom: '3rem' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>What you get</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={18} color="var(--primary)" />
                                Personal Income Summary PDF
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={18} color="var(--primary)" />
                                Clean, professional formatting
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={18} color="var(--primary)" />
                                Client-side generation (no data storage)
                            </li>
                        </ul>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>How it works</h3>
                        <p style={{ marginBottom: '0.75rem' }}>
                            Install the extension, extract your totals, and generate a report locally in your browser.
                        </p>
                        <p style={{ marginBottom: 0, color: 'var(--gray-600)' }}>
                            You only pay when you choose to download a report.
                        </p>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Privacy first</h3>
                        <p style={{ marginBottom: 0 }}>
                            GigProof does not connect to banks, store earnings data, or access your platform credentials.
                        </p>
                    </div>
                </div>

                <div className="card" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Have questions?</h2>
                    <p style={{ marginBottom: '1.25rem', color: 'var(--gray-600)' }}>
                        Check out our FAQ or contact our support team.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link to="/faq" className="btn btn-outline">View FAQ</Link>
                        <Link to="/contact" className="btn btn-primary">Contact Support</Link>
                    </div>
                </div>

                <div className="card card-accent" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '999px', background: 'rgba(5, 150, 105, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={22} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', color: 'var(--primary-dark)' }}>
                            30-Day Money-Back Guarantee
                        </h2>
                        <p style={{ marginBottom: 0, color: 'var(--gray-700)' }}>
                            Not satisfied with your report? We'll refund your purchase. Your trust is our priority.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
