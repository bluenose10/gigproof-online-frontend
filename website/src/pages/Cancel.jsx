import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function Cancel() {
    return (
        <div className="container py-20 flex justify-center">
            <div className="glass-card text-center" style={{ maxWidth: '400px' }}>
                <div className="flex justify-center mb-4">
                    <XCircle size={48} color="#ef4444" />
                </div>
                <h2>Payment Cancelled</h2>
                <p className="mb-6">
                    You have not been charged. The transaction was cancelled.
                </p>
                <Link to="/dashboard" className="btn btn-primary">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
