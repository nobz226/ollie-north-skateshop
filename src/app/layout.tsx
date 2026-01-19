import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Ollie North Skateshop - Premium Skate Gear",
  description:
    "Your one-stop shop for skateboards, longboards, pennyboards, hardware, and apparel. Quality gear for all skill levels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <SignedOut>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">
                  Ollie North Skateshop
                </h1>
                <p className="mb-8 text-gray-600">
                  Please sign in to continue
                </p>
                <SignInButton mode="modal">
                  <button className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
          <SignedIn>{children}</SignedIn>
        </Providers>
      </body>
    </html>
  );
}

