import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/HelveticaNeueMedium.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lanstellar",
  description:
    "Lanstellar is a decentralized finance platform that allows users to borrow, lend, and trade cryptocurrencies with each other.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${helvetica.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
