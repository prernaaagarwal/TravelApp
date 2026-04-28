import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { MobileNav } from "@/components/shared/MobileNav";

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

export const metadata: Metadata = {
  title: "Wander Women",
  description:
    "Trip intel built by women who actually travel solo. Real scams, neighborhoods, transport, hidden gems, and costs — sourced from named contributors.",
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
        <MobileNav />
      </body>
    </html>
  );
}
