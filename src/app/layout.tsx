import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Spectral, UnifrakturCook } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./Providers";

export const dynamic = 'force-dynamic';

// Heavy, spiky blackletter for short titles, matching the logo's weight
const unifraktur = UnifrakturCook({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-unifraktur",
});

// Carved Roman capitals for headings and labels (the Diablo-style UI face)
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
});

// Ornamented capitals for Roman numerals (blackletter turns "IV" into "JV")
const cinzelDeco = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-cinzel-deco",
});

// Sharp book face for body copy and italic Latin names
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: "Carnivorables | Rare Carnivorous Plants, Hand-Grown",
  description:
    "Venus flytraps, pitcher plants, sundews, butterworts and Nepenthes, hand-grown in pure water and shipped with care. Plus seeds and carnivore-safe supplies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#962a22",
          colorBackground: "#161210",
          colorText: "#ece3cf",
          colorTextSecondary: "#9c9282",
          colorInputBackground: "#0d0b0a",
          colorInputText: "#ece3cf",
          colorNeutral: "#ece3cf",
          borderRadius: "0px",
          fontFamily: "var(--font-spectral), Georgia, serif",
        },
      }}
    >
      <html lang="en" className={`${unifraktur.variable} ${cinzel.variable} ${cinzelDeco.variable} ${spectral.variable}`}>
        <body className="antialiased">
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
