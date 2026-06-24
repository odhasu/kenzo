import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FortuneFlips Mentorship",
  description: "Apply For 1-1 Coaching",
  openGraph: {
    title: "FortuneFlips Mentorship",
    description: "Apply For 1-1 Coaching",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "FortuneFlips Mentorship",
    description: "Apply For 1-1 Coaching",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
