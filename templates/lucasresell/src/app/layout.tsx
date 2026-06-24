import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neuePlak = localFont({
  src: [
    { path: "../../public/assets/fonts/neue-plak/neue-plak-regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/fonts/neue-plak/neue-plak-semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/assets/fonts/neue-plak/neue-plak-bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/assets/fonts/neue-plak/neue-plak-extrablack.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucas Resells — The Inner Circle",
  description: "Join the waitlist for exclusive access to Lucas Resells' Inner Circle mentorship program.",
  openGraph: {
    title: "Lucas Resells — The Inner Circle",
    description: "Join the waitlist for exclusive access to Lucas Resells' Inner Circle mentorship program.",
    siteName: "Lucas Resells",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${neuePlak.className} h-full antialiased`}>
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
