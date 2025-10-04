"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI receipt scanning work?",
    answer:
      "Our AI-powered OCR technology automatically extracts key information from receipts including merchant name, date, amount, currency, and line items. Simply upload a photo via mobile app, email, or web interface, and the system processes it in seconds with 99.9% accuracy.",
  },
  {
    question: "Can I set up custom approval workflows?",
    answer:
      "Yes! You can create multi-level approval workflows based on expense amount, category, department, or custom rules. Configure percentage-based approvers or specific individuals, and set up automatic approvals for expenses under certain thresholds.",
  },
  {
    question: "Which currencies are supported?",
    answer:
      "We support 150+ currencies with real-time exchange rates. The system automatically converts foreign currency expenses to your base currency using mid-market rates updated every hour. You can also set custom exchange rates for specific transactions.",
  },
  {
    question: "How do I integrate with my accounting software?",
    answer:
      "We offer native integrations with QuickBooks, Xero, SAP, NetSuite, and other major accounting platforms. The integration syncs expenses, categories, and payment data automatically. Custom integrations are available for Enterprise plans.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use bank-level 256-bit SSL encryption for all data transmission and storage. Our infrastructure is SOC 2 Type II compliant, and we never share your data with third parties. Enterprise plans include SSO, advanced access controls, and audit logs.",
  },
  {
    question: "Can employees submit expenses on mobile?",
    answer:
      "Yes! Our mobile apps for iOS and Android let employees snap receipt photos, submit expenses, and track approval status on the go. They can also forward receipts via email or use our Slack integration for quick submissions.",
  },
  {
    question: "What payment methods are supported for reimbursements?",
    answer:
      "We support direct bank transfers (ACH, SEPA, wire), PayPal, and integration with payroll systems. Reimbursements can be processed individually or in batches, and employees receive notifications when payments are initiated.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! All paid plans include a 14-day free trial with full access to features. No credit card required to start. Our Starter plan is free forever for individuals and small teams processing up to 50 expenses per month.",
  },
  {
    question: "Can I export data for audits and reporting?",
    answer:
      "Absolutely. Export expenses, reports, and analytics in multiple formats including CSV, Excel, and PDF. Create custom reports with filters for date range, department, category, or employee. All exports include receipt images and audit trails.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Starter plans include email support with 24-hour response time. Professional plans get priority email and chat support. Enterprise customers receive dedicated account management, phone support, and custom training sessions.",
  },
];

export default function FAQSection() {
  return (
    <section className="relative py-32" id="faq">
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-950/50 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            FAQ
          </span>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Questions?
            <br />
            <span className="text-gradient">We Have Answers</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Everything you need to know about our expense management platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-card overflow-hidden rounded-xl border-white/10 px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-white hover:text-purple-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-white/60">Still have questions?</p>
          <button className="text-gradient font-semibold hover:underline">
            Contact our support team →
          </button>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
    </section>
  );
}
