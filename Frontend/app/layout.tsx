import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-geist-serif",
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "ENVO AI TOOLS",
  description: "Simple Gemini chat app built with Next.js and Express.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
