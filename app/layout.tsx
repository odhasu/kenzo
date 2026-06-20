import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenzo — Funnel Builder",
  description: "Build high-converting funnels, fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black">{children}</body>
    </html>
  );
}
