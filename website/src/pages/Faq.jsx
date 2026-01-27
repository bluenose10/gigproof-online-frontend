import React from 'react';
import { HelpCircle } from 'lucide-react';
import { CONFIG } from '../config';

export default function Faq() {
    const faqItems = [
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
            question: 'Do you connect to my bank or financial accounts?',
            answer: 'No. GigProof does not connect to banks, credit cards, or financial institutions. There are no bank logins, no Plaid connections, and no Open Banking integrations.'
        },
        {
            question: 'Does GigProof review or approve my income summary?',
            answer: 'No. GigProof generates a summary based solely on what is visible on your dashboard. We do not review, verify, or approve earnings.'
        },
        {
            question: 'Will landlords or lenders accept this PDF?',
            answer: 'Acceptance is entirely up to the third party you choose to share it with. GigProof does not represent that the document will be accepted by any landlord, lender, or institution.'
        },
        {
            question: 'Will this replace bank statements or pay stubs?',
            answer: 'GigProof summarizes gig platform earnings in a clean, professional format. It does not replace bank statements, tax documents, or employer-issued pay stubs. Acceptance is at the discretion of the recipient.'
        },
        {
            question: 'Is GigProof available outside the US?',
            answer: 'Yes. GigProof works anywhere a supported gig platform provides a web dashboard that can be viewed in Chrome. Availability is platform-based, not country-based.'
        },
        {
            question: 'Do I need to install software on my computer?',
            answer: 'You only need Google Chrome and the GigProof Chrome extension. No additional software or downloads are required.'
        },
        {
            question: 'How much does GigProof cost?',
            answer: 'GigProof uses simple, pay-per-report pricing with single and bundle options. You will always see the price before you purchase.'
        },
        {
            question: 'Can I delete my account?',
            answer: 'Yes. You can close your account at any time from your dashboard. Since GigProof does not store income data or PDFs, deleting your account removes your login access only.'
        },
        {
            question: 'Who is GigProof for?',
            answer: 'GigProof is designed for gig workers, independent contractors, freelancers, and anyone earning income through gig platforms.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Yes. GigProof uses secure authentication, no credential storage, and no server-side income data storage. Your data stays in your browser, under your control.'
        }
    ];

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <div className="page-shell">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container">
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="page-hero">
                    <div className="page-icon">
                        <img src="/images/logo.png" alt="GigProof" className="page-logo" />
                    </div>
                    <h1 className="text-center mb-12">Frequently Asked Questions</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {faqItems.map((item) => (
                        <div className="card" key={item.question}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.question}</h3>
                            <p style={{ marginBottom: 0 }}>{item.answer}</p>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
    );
}
