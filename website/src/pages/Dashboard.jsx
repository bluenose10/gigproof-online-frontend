import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, AlertCircle, Download, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { CONFIG } from '../config';

export default function Dashboard() {
    const { user, loading, supabase } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const fullName = user?.user_metadata?.full_name || '';
    const firstName = fullName.trim().split(' ')[0] || 'there';
    const [credits, setCredits] = useState(0);
    const [creditsLoading, setCreditsLoading] = useState(false);

    useEffect(() => {
        if (!CONFIG.PAYMENTS_ENABLED || !user?.id) return;

        const fetchCredits = async () => {
            setCreditsLoading(true);
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('pdf_credits')
                .eq('user_id', user.id)
                .single();

            if (!error && profile) {
                setCredits(profile.pdf_credits || 0);
            }
            setCreditsLoading(false);
        };

        fetchCredits();

        if (location.search.includes('session_id=')) {
            fetchCredits().finally(() => {
                navigate('/dashboard', { replace: true });
            });
        }
    }, [user, supabase, location.search, navigate]);

    // MVP: No backend storage, so no reports to fetch
    // Reports are generated on-demand via the Chrome extension

    if (loading) {
        return <div className="container py-20 text-center">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="container py-20 text-center">
                <AlertCircle size={48} style={{ color: '#059669', marginBottom: '1rem' }} />
                <h2>Please log in to view your dashboard</h2>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Your reports are securely associated with your account.</p>
                <Link to="/login" className="btn btn-primary">Login / Sign Up</Link>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '0.75rem' }}>Welcome back, {firstName}</h1>
                    <p className="page-subtitle">
                        Your income summary is generated on-demand through the GigProof Chrome extension.
                    </p>
                    {CONFIG.PAYMENTS_ENABLED && (
                        <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                            {creditsLoading
                                ? 'Checking credits...'
                                : `${credits} PDF credit${credits === 1 ? '' : 's'} available`}
                        </p>
                    )}
                    <div
                        className="card"
                        style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            maxWidth: '720px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                            border: '1px solid #99f6e4',
                            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)'
                        }}
                    >
                        <h3 style={{ marginBottom: '0.75rem', color: '#134e4a' }}>Next steps</h3>
                        <p style={{ marginBottom: '0.75rem', color: '#115e59' }}>
                            Install the GigProof Chrome extension, then open your gig dashboard below and click Extract Earnings.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <a
                                className="btn btn-primary btn-lg"
                                href={CONFIG.EXTENSION_URL}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Download size={20} />
                                Get the Chrome Extension
                            </a>
                        </div>
                    </div>
                    <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '0.75rem' }}>Open your driver dashboard</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                            {[
                                { name: 'Uber', url: 'https://drivers.uber.com' },
                                { name: 'DoorDash', url: 'https://dasher.doordash.com' },
                                { name: 'Lyft', url: 'https://www.lyft.com/driver' },
                                { name: 'Grubhub', url: 'https://driver.grubhub.com/driver/login' },
                                { name: 'Instacart', url: 'https://shoppers.instacart.com' },
                                { name: 'Amazon Flex', url: 'https://flex.amazon.com' },
                                { name: 'Shipt', url: 'https://shopper.shipt.com' },
                                { name: 'Gopuff', url: 'https://gopuff.com/go/driver' },
                                { name: 'Deliveroo', url: 'https://riders.deliveroo.com' },
                                { name: 'Just Eat', url: 'https://couriers.just-eat.com' }
                            ].map(platform => (
                                <a key={platform.name} href={platform.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: '1px solid #99f6e4', borderRadius: '12px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <span style={{ fontWeight: 600, color: '#134e4a', fontSize: '0.9rem' }}>{platform.name}</span>
                                    <ArrowRight size={16} color="#115e59" />
                                </a>
                            ))}
                        </div>
                        <p style={{ marginTop: '0.75rem', marginBottom: 0, color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                            All links open in a new window. Click the extension on any platform dashboard to extract your earnings.
                        </p>
                    </div>
                </div>

                <div className="info-grid" style={{ marginBottom: '2.5rem' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>1. Install the Extension</h3>
                        <p style={{ marginBottom: 0 }}>
                            Add GigProof to Chrome to read the totals already visible on your gig dashboard.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>2. Extract Earnings</h3>
                        <p style={{ marginBottom: 0 }}>
                            Open Uber or DoorDash, then click “Extract Earnings” in the extension popup.
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>3. Download the PDF</h3>
                        <p style={{ marginBottom: 0 }}>
                            Generate a Personal Income Summary PDF locally and share it anywhere.
                        </p>
                    </div>
                </div>

                <div className="card card-accent" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <FileText size={28} color="var(--primary-dark)" />
                    <div>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Privacy-first by design</h3>
                        <p style={{ marginBottom: 0, color: 'var(--gray-700)' }}>
                            All extraction and PDF generation happens in your browser. GigProof never stores your earnings data or platform credentials.
                        </p>
                    </div>
                </div>

                <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: '1px solid #99f6e4' }}>
                    <h3 style={{ marginBottom: '0.75rem', color: '#134e4a' }}>Need to combine multiple reports?</h3>
                    <p style={{ marginBottom: '1rem', color: '#115e59' }}>
                        Use our free PDF merge tool to combine income summaries from different platforms or time periods.
                    </p>
                    <Link to="/merge" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} />
                        Merge PDFs (Free Tool)
                    </Link>
                </div>
            </div>
        </div>
    );
}

