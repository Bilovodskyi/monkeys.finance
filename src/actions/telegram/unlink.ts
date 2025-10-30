"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import {
    UserTable,
    UserTelegramNotificationSettingsTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function unlinkTelegramAccount() {
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

    // Get user's notification settings before removing
    const settings =
        await db.query.UserTelegramNotificationSettingsTable.findFirst({
            where: eq(UserTelegramNotificationSettingsTable.userId, user.id),
        });

    if (!settings) {
        throw new Error("No Telegram account linked");
    }

    const telegramChatId = settings.telegramChatId;

    // Delete Telegram account link (cascade will delete all related notification preferences)
    await db
        .delete(UserTelegramNotificationSettingsTable)
        .where(eq(UserTelegramNotificationSettingsTable.userId, user.id));

    // Notify user on Telegram
    if (telegramChatId) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN!;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: "🔕 Your account has been unlinked. You will no longer receive notifications.\n\nSend /start to link again.",
            }),
        });
    }

    revalidatePath("/notifications");

    return {
        success: true,
        message: "Telegram account unlinked successfully",
    };
}
