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
  title: "ClickToScript",
  description: "Transcribe Instagram Reels into scripts, summaries, hooks, and timestamped lines.",
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
