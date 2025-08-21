import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
import localFont from "next/font/local";

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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
