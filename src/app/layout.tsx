import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "CivicTrail — who's responsible for public works in your area",
  description:
    "Trace which agency, officials and elected representatives are responsible for pending public works in a Delhi ward — with sources and verification dates for every claim.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="font-semibold tracking-tight text-foreground"
            >
              Civic<span className="text-brand">Trail</span>
            </Link>
            <span className="text-xs text-muted">MVP · Vikaspuri (AC-31)</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border bg-surface">
          <div className="mx-auto w-full max-w-4xl px-4 py-4 text-xs text-muted">
            Every claim links to its source and verification date. Facts are
            labelled verified, inferred, or unverified — CivicTrail does not
            invent projects, officials, costs, or statuses.
          </div>
        </footer>
      </body>
    </html>
  );
}
