import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { CONFIG } from '../config';
import { useAuth } from '../AuthContext';

export default function Checkout() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [error, setError] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!CONFIG.PAYMENTS_ENABLED) {
            navigate(`/download/${reportId}`);
            return;
        }

        if (!loading && !user) {
            navigate(`/login?redirect=/checkout/${reportId}`);
            return;
        }

        if (!loading && user?.id && !started) {
            setStarted(true);
            startCheckout();
        }
    }, [reportId, navigate, user, loading, started]);

    const startCheckout = async () => {
        try {
            const res = await fetch(CONFIG.STRIPE_CHECKOUT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': CONFIG.SUPABASE_PUBLISHABLE_KEY
                },
                body: JSON.stringify({
                    priceId: CONFIG.STRIPE_PRICE_SINGLE,
                    planType: 'single',
                    userId: user.id
                })
            });

            const body = await res.json();
            if (body.url) {
                window.location.href = body.url;
                return;
            }

            setError('Failed to start checkout.');
        } catch (e) {
            console.error(e);
            setError('Error starting checkout.');
        }
    };

    return (
        <div className="container py-20">
            <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline mb-8"
                style={{ border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="flex justify-center">
                <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="text-center mb-8">
                        <div style={{ background: '#d1fae5', width: 'fit-content', padding: '1rem', borderRadius: '50%', margin: '0 auto 1rem auto' }}>
                            <Lock size={32} color="#059669" />
                        </div>
                        <h2>Redirecting to Stripe</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            {error || 'Launching secure checkout...'}
                        </p>
                    </div>

                    {!error && (
                        <div className="text-center py-4">
                            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                            <p>One moment...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
