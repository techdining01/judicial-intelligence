import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Judicial Intelligence Platform",
  description: "AI-powered Nigerian legal intelligence — research, operations, training",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
