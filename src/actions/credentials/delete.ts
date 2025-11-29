"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { userCredentials } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export type DeleteCredentialsInput = {
    exchange: string;
};

export type DeleteCredentialsResult =
    | { ok: true }
    | {
          ok: false;
          error:
              | "unauthorized"
              | "userNotFound"
              | "invalidInput"
              | "notFound"
              | "deleteFailed"
              | "unexpected";
      };

/**
 * Delete encrypted API credentials for a user's exchange.
 */
export async function deleteCredentials(
    input: DeleteCredentialsInput
): Promise<DeleteCredentialsResult> {
    try {
        // 1. Authenticate user
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return { ok: false, error: "unauthorized" };
        }

        // 2. Get user from database
        const user = await db.query.UserTable.findFirst({
            where: (t, { eq }) => eq(t.clerkId, clerkId),
        });

        if (!user) {
            console.log("[deleteCredentials] User not found for clerkId:", clerkId);
            return { ok: false, error: "userNotFound" };
        }

        // 3. Validate input
        if (!input.exchange) {
            return { ok: false, error: "invalidInput" };
        }

        // 4. Convert exchange to lowercase for enum matching
        const exchangeEnum = input.exchange.toLowerCase() as any;

        // 5. Check if credentials exist
        const existingCredentials = await db.query.userCredentials.findFirst({
            where: (t, { eq, and }) =>
                and(eq(t.userId, user.id), eq(t.exchange, exchangeEnum)),
        });

        if (!existingCredentials) {
            return { ok: false, error: "notFound" };
        }

        // 6. Delete credentials
        try {
            await db
                .delete(userCredentials)
                .where(
                    and(
                        eq(userCredentials.userId, user.id),
                        eq(userCredentials.exchange, exchangeEnum)
                    )
                );

            return { ok: true };
        } catch (error) {
            console.error("[deleteCredentials] Database delete failed:", error);
            return { ok: false, error: "deleteFailed" };
        }
    } catch (error) {
        console.error("[deleteCredentials] Unexpected error:", error);
        return { ok: false, error: "unexpected" };
    }
}
