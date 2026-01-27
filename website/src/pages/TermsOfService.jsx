import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="page-shell">
            <div className="container" style={{ maxWidth: '900px' }}>

                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Terms of Service</h1>
                    <div className="page-meta">Last updated: January 22, 2026</div>
                </div>

                <div className="card card-accent mb-8">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Agreement to Terms</h2>
                    <p style={{ color: 'var(--gray-700)', marginBottom: 0 }}>
                        By accessing or using GigProof ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Service Description</h2>
                    <p style={{ marginBottom: '0.5rem' }}>GigProof provides personal income summaries for gig economy workers. Our service:</p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li>Uses a Chrome extension to read earnings totals visible on your dashboard</li>
                        <li>Generates a Personal Income Summary PDF locally in your browser</li>
                        <li>Provides secure authentication and optional payment processing</li>
                        <li>Does not connect to bank accounts or platform APIs</li>
                    </ul>
                    <div className="note-card" style={{ marginTop: '1rem' }}>
                        <p style={{ marginBottom: 0, color: 'var(--gray-800)', fontSize: '0.95rem' }}>
                            <strong>Important:</strong> GigProof generates user-created summaries for informational purposes. We do not confirm income for any third party. Acceptance is at the discretion of landlords, lenders, and other recipients. GigProof is not a consumer reporting agency under the Fair Credit Reporting Act (FCRA).
                        </p>
                    </div>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>User Obligations</h2>
                    <p style={{ marginBottom: '0.75rem' }}>By using our Service, you agree to:</p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li>Provide accurate and complete information when creating your account</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Use the Service only for lawful purposes</li>
                        <li>Not attempt to access other users' accounts or data</li>
                        <li>Not use automated tools to access or misrepresent your income</li>
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Not reverse engineer, decompile, or attempt to extract source code</li>
                    </ul>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Payment Terms</h2>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Report Credits</h3>
                    <p style={{ marginBottom: 0 }}>
                        GigProof uses pay-per-report pricing. Credits are applied when you download a report. Pricing will always be clearly shown before you complete any purchase.
                    </p>
                </div>

                <div className="card mb-6" style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#92400e' }}>Limitation of Liability</h2>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: '#92400e' }}>No Promise of Acceptance</h3>
                    <p style={{ marginBottom: '1rem', color: '#7c5b2f' }}>
                        GigProof does not promise that lenders, landlords, or any third parties will accept our reports. The decision to accept these documents is solely at the discretion of the receiving party.
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: '#92400e' }}>Data Accuracy</h3>
                    <p style={{ marginBottom: '1rem', color: '#7c5b2f' }}>
                        While we strive for accurate data extraction, we cannot ensure that all transactions will be correctly identified or categorized. You are responsible for reviewing your report for accuracy.
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: '#92400e' }}>Service Availability</h3>
                    <p style={{ marginBottom: '1rem', color: '#7c5b2f' }}>
                        We do not promise uninterrupted or error-free service. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
                    </p>

                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: '#92400e' }}>Limitation of Damages</h3>
                    <p style={{ marginBottom: 0, color: '#7c5b2f' }}>
                        To the maximum extent permitted by law, GigProof shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Intellectual Property</h2>
                    <p style={{ marginBottom: 0 }}>
                        The Service, its original content, features, and functionality are owned by GigProof and protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without express written permission.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Account Termination</h2>
                    <p style={{ marginBottom: '0.75rem' }}>We reserve the right to suspend or terminate your account if:</p>
                    <ul style={{ marginLeft: '1.5rem', color: 'var(--gray-700)' }}>
                        <li>You violate these Terms of Service</li>
                        <li>You engage in fraudulent or illegal activity</li>
                        <li>You misuse the Service</li>
                        <li>Required by law or court order</li>
                    </ul>
                    <p style={{ marginTop: '1rem', marginBottom: 0 }}>
                        You may delete your account at any time through your account settings. Upon termination, your right to use the Service will immediately cease, and all data will be permanently deleted in accordance with our <Link to="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Dispute Resolution</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        If you have a dispute with GigProof, we encourage you to <Link to="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>contact us</Link> first via our contact form to attempt to resolve the issue.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which GigProof operates, without regard to its conflict of law provisions.
                    </p>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Changes to Terms</h2>
                    <p style={{ marginBottom: 0 }}>
                        We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Service after changes are posted means you accept the updated Terms on this page and updating the "Last updated" date.
                    </p>
                </div>

                <div className="card card-accent">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Contact Us</h2>
                    <p style={{ color: 'var(--gray-700)' }}>
                        If you have questions about these Terms of Service, please <Link to="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>contact us</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
