import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { generateIncomeSummaryPdf } from '../utils/pdf';

export default function Success() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [generating, setGenerating] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            // Auto-generate if not already done
            handleGenerate();
        }
    }, [user, loading]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const dataStr = localStorage.getItem('pendingReport');
            if (!dataStr) {
                console.warn('No pending report data found');
                return;
            }
            const rawData = JSON.parse(dataStr);
            const data = {
                ...rawData,
                grossEarnings: rawData.grossEarnings || rawData.earnings || rawData.totalEarnings || rawData.total
            };

            // Generate PDF (Client Side)
            const doc = generateIncomeSummaryPdf({
                data,
                userEmail: user.email,
                userName: user.user_metadata?.full_name
            });

            // Save
            doc.save('GigProof_Income_Summary.pdf');
            setDownloaded(true);

            // Clear pending data (optional, or keep for re-download)
            // localStorage.removeItem('pendingReport'); 

        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container py-20 flex justify-center">
            <div className="glass-card text-center" style={{ maxWidth: '500px' }}>
                <div className="flex justify-center mb-6">
                    <CheckCircle size={64} color="#16a34a" />
                </div>
                <h1>Payment Successful!</h1>
                <p className="mb-6">
                    Thank you for your purchase. Your secure income summary has been unlocked.
                </p>

                {downloaded ? (
                    <div className="bg-green-50 p-4 rounded mb-4 text-green-700">
                        <p>✓ Download started automatically.</p>
                    </div>
                ) : (
                    <p className="mb-4">{generating ? 'Generating PDF...' : 'Preparing your download...'}</p>
                )}

                <button
                    onClick={handleGenerate}
                    className="btn btn-primary w-full flex justify-center items-center gap-2"
                >
                    <Download size={20} /> Download Again
                </button>
            </div>
        </div>
    );
}
