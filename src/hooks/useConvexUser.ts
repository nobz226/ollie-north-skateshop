import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useConvexUser() {
  const { user: clerkUser, isLoaded } = useUser();

  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser?.id ? { clerkUserId: clerkUser.id } : "skip"
  );

  return {
    convexUser,
    isLoading: !isLoaded || (clerkUser && !convexUser),
  };
}