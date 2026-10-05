"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { MotionConfig } from "framer-motion";
import SyncUser from "@/components/SyncUser";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <SyncUser />
      {/* Respect the OS "reduce motion" setting for every framer-motion animation */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ConvexProvider>
  );
}