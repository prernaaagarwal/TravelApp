import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { MobileNav } from "@/components/shared/MobileNav";
import { PostHogProvider } from "@/components/shared/PostHogProvider";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { PWA } from "@/components/shared/PWA";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wanderwomen.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wander Women — Trip Intel for Solo Women Travellers",
    template: "%s — Wander Women",
  },
  description:
    "Trip intel built by women who actually travel solo. Real scams, neighborhoods, transport, hidden gems, and costs — sourced from named contributors.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wander Women",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    siteName: "Wander Women",
    title: "Wander Women — Trip Intel for Solo Women Travellers",
    description:
      "The guidebook that was never written for you, yet. Real scams, female-run stays, transit safety — written by women who arrived last week.",
    url: SITE_URL,
    images: [
      {
        url: "/images/hero-rishikesh.jpg",
        width: 1200,
        height: 630,
        alt: "A woman watching dawn over the Ganges in Rishikesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wander Women — Trip Intel for Solo Women Travellers",
    description:
      "Real scams, female-run stays, transit safety — written by women who arrived last week.",
    images: ["/images/hero-rishikesh.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd()} />
        <PostHogProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <MobileNav />
          <CookieConsentBanner />
        </PostHogProvider>
        <PWA />
      </body>
    </html>
  );
}
