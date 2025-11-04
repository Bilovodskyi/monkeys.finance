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

export async function createNotification(data: {
    provider: string;
    instrument: string;
    strategy: string;
}) {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        throw new Error("Unauthorized: No user ID found");
    }

    // Look up user's database UUID
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.clerkId, clerkUserId),
    });

    if (!user) {
        throw new Error("User not found in database");
    }

    const { provider, instrument, strategy } = data;

    // Validate input
    if (!provider || !instrument || !strategy) {
        throw new Error("Provider, instrument, and strategy are required");
    }

    // Normalize provider to lowercase
    const normalizedProvider = provider.toLowerCase();

    // If provider is Telegram, verify account is linked and get account ID
    let telegramAccountId: string | undefined;
    if (normalizedProvider === "telegram") {
        const telegramAccount =
            await db.query.UserTelegramNotificationSettingsTable.findFirst({
                where: eq(
                    UserTelegramNotificationSettingsTable.userId,
                    user.id
                ),
            });

        if (!telegramAccount) {
            throw new Error(
                "Please link your Telegram account first. Open Telegram, search for @algo_squid_bot, and send /start"
            );
        }

        telegramAccountId = telegramAccount.id;
    }

    try {
        // Create notification preference
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

        revalidatePath("/notifications");

        return {
            success: true,
            message: "Notification preference created successfully!",
            preference: newPreference,
        };
    } catch (error: any) {
        // Handle unique constraint violation
        if (error?.code === "23505") {
            throw new Error(
                "You already have a notification set up for this combination"
            );
        }
        throw new Error("Failed to create preference");
    }
}

export async function deleteNotification(preferenceId: string) {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        throw new Error("Unauthorized: No user ID found");
    }

    // Look up user's database UUID
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.clerkId, clerkUserId),
    });

    if (!user) {
        throw new Error("User not found in database");
    }

    if (!preferenceId) {
        throw new Error("Preference ID required");
    }

    // Verify the preference belongs to the user before deleting
    const preference = await db.query.NotificationPreferencesTable.findFirst({
        where: eq(NotificationPreferencesTable.id, preferenceId),
    });

    if (!preference) {
        throw new Error("Notification preference not found");
    }

    if (preference.userId !== user.id) {
        throw new Error("Unauthorized: This preference does not belong to you");
    }

    // Delete the preference
    await db
        .delete(NotificationPreferencesTable)
        .where(eq(NotificationPreferencesTable.id, preferenceId));

    revalidatePath("/notifications");

    return {
        success: true,
        message: "Notification preference deleted successfully!",
    };
}

export async function getNotifications() {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        throw new Error("Unauthorized: No user ID found");
    }

    // Get user's database UUID from Clerk ID
    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.clerkId, clerkUserId),
    });

    if (!user) {
        throw new Error("User not found in database");
    }

    // Get all notification preferences
    const preferences = await db
        .select()
        .from(NotificationPreferencesTable)
        .where(eq(NotificationPreferencesTable.userId, user.id));

    // Get Telegram account info if exists
    const telegramAccount =
        await db.query.UserTelegramNotificationSettingsTable.findFirst({
            where: eq(UserTelegramNotificationSettingsTable.userId, user.id),
        });

    // Return preferences with Telegram username added for display
    return preferences.map((pref) => ({
        ...pref,
        telegramUsername: telegramAccount?.telegramUsername || null,
    }));
}
