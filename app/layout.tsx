import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Tool Spend Audit',
  description: 'Find out if your startup is overpaying for AI tools. Get an instant audit of your Cursor, Claude, ChatGPT, and Copilot spend.',
  openGraph: {
    title: 'SpendLens — Free AI Tool Spend Audit',
    description: 'Find out if your startup is overpaying for AI tools. Get an instant free audit.',
    type: 'website',
    siteName: 'SpendLens',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens — Free AI Tool Spend Audit',
    description: 'Find out if your startup is overpaying for AI tools.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
