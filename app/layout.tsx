import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kenzo — Funnel Builder",
  description: "Build and scale high-ticket funnels with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark h-full antialiased ${inter.variable} ${lora.variable}`}>
      <body className="min-h-full bg-kenzo-deep text-kenzo-text font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
