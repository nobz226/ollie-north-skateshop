"use client";

import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  // Simple layout without authentication check for login page
  return <>{children}</>;
}