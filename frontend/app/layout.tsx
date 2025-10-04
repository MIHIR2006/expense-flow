import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://expense-flow.vercel.app'),
  title: 'ExpenseFlow - Modern Expense Management Platform',
  description: 'Automate approvals, scan receipts with AI, and manage expenses across teams in one powerful platform. Join 10,000+ companies transforming their expense management.',
  keywords: ['expense management', 'receipt scanning', 'expense tracking', 'AI OCR', 'approval workflows'],
  openGraph: {
    title: 'ExpenseFlow - Expense Management, Reimagined',
    description: 'The modern expense management platform built for teams of all sizes.',
    type: 'website',
    url: 'https://expense-flow.vercel.app',
    siteName: 'ExpenseFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExpenseFlow - Expense Management, Reimagined',
    description: 'The modern expense management platform built for teams of all sizes.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
