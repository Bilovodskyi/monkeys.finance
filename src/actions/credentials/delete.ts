"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { userCredentials, InstanceTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type DeleteCredentialsInput = {
    exchange: string;
};

export type DeleteCredentialsResult =
    | { ok: true; deletedInstancesCount: number }
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
 * Also deletes all instances that use this exchange.
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

        // 6. Delete all instances with this exchange first
        try {
            const deletedInstances = await db
                .delete(InstanceTable)
                .where(
                    and(
                        eq(InstanceTable.userId, user.id),
                        eq(InstanceTable.exchange, exchangeEnum)
                    )
                )
                .returning();

            // 7. Delete credentials
            await db
                .delete(userCredentials)
                .where(
                    and(
                        eq(userCredentials.userId, user.id),
                        eq(userCredentials.exchange, exchangeEnum)
                    )
                );

            // Revalidate paths to refresh the UI
            revalidatePath("/bot");
            revalidatePath("/instances");

            return { ok: true, deletedInstancesCount: deletedInstances.length };
        } catch (error) {
            console.error("[deleteCredentials] Database delete failed:", error);
            return { ok: false, error: "deleteFailed" };
        }
    } catch (error) {
        console.error("[deleteCredentials] Unexpected error:", error);
        return { ok: false, error: "unexpected" };
    }
}
