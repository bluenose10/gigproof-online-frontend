import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Shield } from 'lucide-react';

export default function StripeCheckoutForm({ onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/download?payment_check=true`, // Simplified return for now
            },
            redirect: "if_required" // Handle redirect manually if needed, or stick to auto
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else {
            // Payment succeeded
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
                <PaymentElement />
            </div>
            {errorMessage && (
                <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {errorMessage}
                </div>
            )}
            <button
                disabled={isProcessing || !stripe || !elements}
                id="submit"
                className="btn btn-primary w-full"
                style={{ padding: '1rem', fontSize: '1.1rem', gap: '0.5rem' }}
            >
                <span id="button-text">
                    {isProcessing ? "Processing..." : (
                        <><Shield size={20} /> Pay Separately & Unlock</>
                    )}
                </span>
            </button>
        </form>
    );
}
