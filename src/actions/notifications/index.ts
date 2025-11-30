"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import {
    UserTable,
    NotificationPreferencesTable,
    UserTelegramNotificationSettingsTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hasEntitlement } from "@/lib/entitlements";
import { z } from "zod";

// Input validation schema
const createNotificationSchema = z.object({
    provider: z.string().min(1).toLowerCase(),
    instrument: z.string().min(1),
    strategy: z.string().min(1),
});

// Result type for type safety
type CreateNotificationResult =
    | { ok: true; preference: typeof NotificationPreferencesTable.$inferSelect }
    | {
          ok: false;
          error:
              | "unauthorized"
              | "invalidInput"
              | "userNotFound"
              | "subscriptionEnded"
              | "telegramNotLinked"
              | "duplicatePreference"
              | "failedToCreate"
              | "unexpected";
      };

export async function createNotification(
    data: unknown
): Promise<CreateNotificationResult> {
    try {
        // 1. Auth check
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return { ok: false, error: "unauthorized" };
        }

        // 2. Input validation
        const parseResult = createNotificationSchema.safeParse(data);
        if (!parseResult.success) {
            return { ok: false, error: "invalidInput" };
        }
        const { provider, instrument, strategy } = parseResult.data;

        // 3. Get user
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.clerkId, clerkUserId),
        });
        if (!user) {
            return { ok: false, error: "userNotFound" };
        }

        // 4. Check entitlement
        if (!hasEntitlement(user)) {
            return { ok: false, error: "subscriptionEnded" };
        }

        // 5. Provider-specific validation (Telegram)
        let telegramAccountId: string | undefined;
        if (provider === "telegram") {
            const telegramAccount =
                await db.query.UserTelegramNotificationSettingsTable.findFirst({
                    where: eq(
                        UserTelegramNotificationSettingsTable.userId,
                        user.id
                    ),
                });

            if (!telegramAccount) {
                return { ok: false, error: "telegramNotLinked" };
            }

            telegramAccountId = telegramAccount.id;
        }

        // 6. Create notification preference
        const [newPreference] = await db
            .insert(NotificationPreferencesTable)
            .values({
                userId: user.id,
                provider: "telegram",
                providerId: telegramAccountId,
                instrument,
                strategy,
            })
            .returning();

        if (!newPreference) {
            return { ok: false, error: "failedToCreate" };
        }

        revalidatePath("/notifications");

        return {
            ok: true,
            preference: newPreference,
        };
    } catch (error: unknown) {
        // Handle unique constraint violation
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            return { ok: false, error: "duplicatePreference" };
        }

        console.error("[createNotification] Unexpected error:", error);
        return { ok: false, error: "unexpected" };
    }
}

// Delete notification - keep mostly the same but improve error handling
type DeleteNotificationResult =
    | { ok: true }
    | {
          ok: false;
          error:
              | "unauthorized"
              | "invalidInput"
              | "userNotFound"
              | "notFound"
              | "notOwner"
              | "unexpected";
      };

export async function deleteNotification(
    preferenceId: unknown
): Promise<DeleteNotificationResult> {
    try {
        // 1. Auth check
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return { ok: false, error: "unauthorized" };
        }

        // 2. Input validation
        if (typeof preferenceId !== "string" || !preferenceId) {
            return { ok: false, error: "invalidInput" };
        }

        // 3. Get user
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.clerkId, clerkUserId),
        });
        if (!user) {
            return { ok: false, error: "userNotFound" };
        }

        // 4. Verify preference exists and belongs to user
        const preference =
            await db.query.NotificationPreferencesTable.findFirst({
                where: eq(NotificationPreferencesTable.id, preferenceId),
            });

        if (!preference) {
            return { ok: false, error: "notFound" };
        }

        if (preference.userId !== user.id) {
            return { ok: false, error: "notOwner" };
        }

        // 5. Delete the preference
        await db
            .delete(NotificationPreferencesTable)
            .where(eq(NotificationPreferencesTable.id, preferenceId));

        revalidatePath("/notifications");

        return { ok: true };
    } catch (error: unknown) {
        console.error("[deleteNotification] Unexpected error:", error);
        return { ok: false, error: "unexpected" };
    }
}
