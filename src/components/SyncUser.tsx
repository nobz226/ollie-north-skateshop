"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

export default function SyncUser() {
  const { user } = useUser();
  const addUser = useMutation(api.addUser.default);
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run once per user session using ref
    if (user?.id && !hasRun.current) {
      hasRun.current = true;
      addUser({ clerkUserId: user.id }).catch((error) => {
        console.error("Error syncing user:", error);
        hasRun.current = false; // Reset on error to allow retry
      });
    }
  }, [user?.id, addUser]);

  return null;
}

