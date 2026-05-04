import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { MobileNavWrapper } from "@/components/shared/MobileNavWrapper";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wanderwomen.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Wander Women",
  description:
    "Trip intel built by women who actually travel solo. Real scams, neighborhoods, transport, hidden gems, and costs — sourced from named contributors.",
  openGraph: {
    siteName: "Wander Women",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wander Women",
  },
  icons: {
    apple: "/icons/icon-192.png",
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
      className={`${cormorant.variable} ${dmMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col pb-16 md:pb-0">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <MobileNavWrapper />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </body>
    </html>
  );
}
