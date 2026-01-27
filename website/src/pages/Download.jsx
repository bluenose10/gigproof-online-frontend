import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download as DownloadIcon, Lock, FileText, AlertCircle } from 'lucide-react';
import { CONFIG } from '../config';
import { useAuth } from '../AuthContext';
import { generateIncomeSummaryPdf } from '../utils/pdf';

export default function Download() {
    const { user, loading, supabase } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [credits, setCredits] = useState(0);
    const [creditsLoading, setCreditsLoading] = useState(false);

    const normalizeReportData = (payload) => {
        if (!payload) return null;
        const grossEarnings = payload.grossEarnings || payload.earnings || payload.totalEarnings || payload.total;
        return {
            ...payload,
            grossEarnings
        };
    };

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login?redirect=/download');
            return;
        }

        const stored = localStorage.getItem('pendingReport');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const normalized = normalizeReportData(parsed);
                setData(normalized);
                setDataLoading(false);
            } catch (e) {
                setDataLoading(false);
            }
            return;
        }

        const retryTimer = window.setTimeout(() => {
            const retryStored = localStorage.getItem('pendingReport');
            if (!retryStored) {
                setDataLoading(false);
                return;
            }
            try {
                const parsed = JSON.parse(retryStored);
                const normalized = normalizeReportData(parsed);
                setData(normalized);
            } catch (e) { }
            setDataLoading(false);
        }, 900);

        return () => window.clearTimeout(retryTimer);
    }, [user, loading, navigate]);

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
    }, [user, supabase]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin && event.origin !== window.location.origin) {
                return;
            }
            if (event?.data?.type === 'GIGPROOF_REPORT_DATA') {
                const payload = event.data.data;
                if (payload) {
                    const normalized = normalizeReportData(payload);
                    setData(normalized);
                    localStorage.setItem('pendingReport', JSON.stringify(normalized));
                    setDataLoading(false);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        window.postMessage({ type: 'GIGPROOF_REQUEST_REPORT' }, '*');
        return () => window.removeEventListener('message', handleMessage);
    }, []);


    const handlePaidDownload = async () => {
        if (!data || !user?.id) return;

        setProcessing(true);
        try {
            const doc = generateIncomeSummaryPdf({
                data,
                userEmail: user.email,
                userName: user.user_metadata?.full_name,
                watermarked: false
            });
            doc.save('GigProof_Income_Summary.pdf');
            localStorage.removeItem('pendingReport');

            // Deduct credit
            const { error } = await supabase.rpc('use_pdf_credit', {
                p_user_id: user.id
            });

            if (error) {
                console.error(error);
                alert('Saved PDF, but failed to update credits. Please contact support.');
            } else {
                const newCredits = Math.max(credits - 1, 0);
                setCredits(newCredits);

                // Log download to tracking table
                await supabase.from('pdf_downloads').insert({
                    user_id: user.id,
                    platform: Array.isArray(data.platform) ? data.platform.join(', ') : data.platform,
                    date_range: data.dateRange,
                    gross_earnings: data.grossEarnings,
                    currency: data.currency,
                    credits_used: 1,
                    credits_remaining: newCredits
                });
            }
        } catch (e) {
            alert('Error generating PDF');
        } finally {
            setProcessing(false);
        }
    };

    const startCheckout = async (planType, priceId) => {
        if (!user?.id) {
            alert('Please log in to continue');
            return;
        }

        setProcessing(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;

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
            setProcessing(false);
        }
    };

    if (loading || dataLoading) {
        return <div className="p-20 text-center">Preparing your income summary...</div>;
    }

    if (!data) {
        return (
            <div className="container py-20 flex justify-center">
                <div className="glass-card text-center" style={{ marginTop: '2rem' }}>
                    <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <h2>No Report Data Found</h2>
                    <p>Please use the Chrome Extension to extract your earnings first.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-20 flex justify-center">
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
                <h1 className="text-center mb-6">Income Summary Ready</h1>

                <div style={{
                    background: 'linear-gradient(135deg, #fef9e7 0%, #fef5e7 100%)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    border: '1px solid #f9e79f',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-emerald-600" size={24} />
                        <span className="font-semibold" style={{ fontSize: '1.1rem' }}>
                            {data.platform ? (Array.isArray(data.platform) ? data.platform.join(' & ') : data.platform.replace(' (Test)', '')) : 'Platform'} Earnings
                        </span>
                    </div>
                    <div className="text-sm text-gray-700 pl-9" style={{ fontSize: '0.95rem' }}>
                        {data.dateRange || 'Recent Activity'} • <span style={{ fontWeight: '600', color: '#047857' }}>{data.grossEarnings || '$0.00'}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-500 text-center mb-6">
                    This report reflects the earnings and date range currently shown on your gig platform dashboard.
                </p>

                {CONFIG.PAYMENTS_ENABLED ? (
                    <div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                            <p className="text-sm text-gray-600 text-center">
                                {creditsLoading
                                    ? 'Checking your report credits...'
                                    : `You have ${credits} report credit${credits === 1 ? '' : 's'} available.`}
                            </p>
                        </div>

                        {credits > 0 ? (
                            <button
                                onClick={handlePaidDownload}
                                disabled={processing}
                                className="btn btn-primary w-full flex justify-center items-center gap-2 text-lg py-4"
                            >
                                {processing ? 'Generating...' : (
                                    <>
                                        <DownloadIcon size={20} /> Download PDF Report (1 credit)
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => startCheckout('single', CONFIG.STRIPE_PRICE_SINGLE)}
                                    disabled={processing}
                                    className="btn btn-primary w-full flex justify-center items-center gap-2 text-lg py-4"
                                    style={{ marginBottom: '0.5rem' }}
                                >
                                    {processing ? 'Processing...' : (
                                        <>
                                            <Lock size={20} /> Buy 1 Report
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => startCheckout('bundle', CONFIG.STRIPE_PRICE_BUNDLE)}
                                    disabled={processing}
                                    className="btn btn-primary w-full flex justify-center items-center gap-2 text-lg py-4"
                                >
                                    {processing ? 'Processing...' : (
                                        <>
                                            <Lock size={20} /> Buy 10 Reports
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 text-center mb-6">
                            Payments are currently unavailable. Please try again later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
