// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // Added this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuantResume | Surgical ATS Optimization",
  description: "Data-driven resume engineering to beat the ATS algorithms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics /> {/* Added this */}
      </body>
    </html>
  );
}