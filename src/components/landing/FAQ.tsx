import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is my bank information safe?",
    answer:
      "Absolutely. We use Plaid, the same secure connection used by major banks and financial apps like Venmo and Robinhood. We never see or store your login credentials. Your data is encrypted with 256-bit SSL encryption.",
  },
  {
    question: "Which gig platforms do you support?",
    answer: (
      <>
        We automatically detect income from all major gig platforms including{" "}
        <Link to="/uber-driver-income-verification" className="text-primary hover:underline font-medium">
          Uber
        </Link>
        , Lyft,{" "}
        <Link to="/doordash-income-verification" className="text-primary hover:underline font-medium">
          DoorDash
        </Link>
        , Grubhub, Instacart, Amazon Flex, Shipt, Postmates, and more. If money from a gig platform hits your bank account, we can track it.
      </>
    ),
  },
  {
    question: "Can I submit this report to lenders and landlords?",
    answer:
      "Yes! Our reports are designed to meet lender requirements. They include bank-verified transaction data, income averages, consistency scores, and professional formatting. You can submit these reports to any lender or landlord. Many of our users have successfully submitted GigProof reports for mortgages, car loans, and apartment applications.",
  },
  {
    question: "How long does it take to generate a report?",
    answer:
      "Once you connect your bank account, your report is generated instantly. You can download it as a PDF within minutes of signing up.",
  },
  {
    question: "What's included in the free report vs. premium?",
    answer:
      "The free report includes your basic income summary with a watermark so you can preview what lenders will see. Premium reports ($9.99 one-time, or $79.99 for 10 reports) include detailed charts, 12-month projections, platform breakdowns, consistency analysis, and no watermarks — professional formatting ready to submit to lenders.",
  },
  {
    question: "Can I update my report with new data?",
    answer:
      "Yes! Your data syncs automatically. You can generate a new report anytime with your latest transactions. Unlimited subscribers get unlimited report refreshes.",
  },
  {
    question: "Do you support UK/Europe?",
    answer:
      "Currently US-only. International expansion planned for 2027.",
  },
];

const FAQ = () => {
  // Add FAQ schema for SEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is my bank information safe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, your data is protected with bank-level encryption. We use Plaid's secure infrastructure (trusted by Venmo, Robinhood). We never store your bank login credentials, and you can revoke access anytime."
          }
        },
        {
          "@type": "Question",
          "name": "Which gig platforms do you support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We support all major US gig platforms including Uber, Lyft, DoorDash, Instacart, Grubhub, Amazon Flex, and more. If your platform isn't listed, contact us."
          }
        },
        {
          "@type": "Question",
          "name": "Can I submit this report to lenders and landlords?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our reports are bank-verified and display official transaction data with income averages, consistency scores, and projected annual income. You can submit these reports to any lender or landlord. Most lenders prefer bank verification over manual paystubs."
          }
        },
        {
          "@type": "Question",
          "name": "How much does it cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Single reports cost $9.99 USD. We also offer a 10-report bundle for $79.99 (20% discount). No subscriptions or hidden fees."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to generate a report?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reports are generated instantly once you connect your bank account. The entire process takes 5-10 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Do you support UK/Europe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently US-only. International expansion planned for 2027."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about GigProof
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm px-6 shadow-card transition-all hover:shadow-elevated"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
