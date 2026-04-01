import type { Metadata } from "next";
import type { CSSProperties } from "react";
import localFont from "next/font/local";
import { QueryProvider } from "@/components/providers/query-provider";
import { themeCssVariables } from "@/constants/theme";
import "./globals.css";

const dazzleFont = localFont({
  src: [
    {
      path: "../assets/fonts/DazzleUnicaseLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/DazzleUnicaseMedium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-dazzle",
});

const dinFont = localFont({
  src: "../assets/fonts/dinpro_light.otf",
  weight: "300",
  style: "normal",
  variable: "--font-din",
});

const neuebitFont = localFont({
  src: "../assets/fonts/neuebit-bold.otf",
  weight: "700",
  style: "normal",
  variable: "--font-neuebit",
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
      <body
        className={`${dazzleFont.variable} ${dinFont.variable} ${neuebitFont.variable}`}
        style={themeCssVariables as CSSProperties}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
