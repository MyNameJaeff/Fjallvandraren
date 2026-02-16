import type { Metadata } from "next";
import { Geist, Geist_Mono, Julius_Sans_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const juliusSansOne = Julius_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-julius-sans-one",
});

export const metadata: Metadata = {
  title: "Fjällvandraren",
  description: "Fjällvandraren – hiking trips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${juliusSansOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}