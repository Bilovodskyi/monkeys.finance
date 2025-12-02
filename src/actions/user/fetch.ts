"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";

export type UserData = {
    id: string;
    clerkId: string;
    email: string;
    name: string;
    billingStatus: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    subscriptionEndsAt: Date | null;
    cancelAtPeriodEnd: boolean | null;
};

/**
 * Server action to fetch the current authenticated user from database.
 * Returns null if user doesn't exist yet (Clerk webhook still processing).
 */
export async function fetchCurrentUser(): Promise<UserData | null> {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    const user = await db.query.UserTable.findFirst({
        where: (t, { eq }) => eq(t.clerkId, clerkId),
    });

    return user || null;
}
