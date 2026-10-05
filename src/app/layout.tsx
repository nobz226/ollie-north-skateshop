import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./Providers";

export const dynamic = 'force-dynamic';

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "MD Plants | Carnivorous Plants for Enthusiasts",
  description:
    "Venus flytraps, pitcher plants, sundews, butterworts and Nepenthes, nursery-grown and shipped with care. Plus seeds and carnivorous-safe growing supplies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}>
        <body className="antialiased">
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
