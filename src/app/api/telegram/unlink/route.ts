import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import {
    UserTable,
    UserTelegramNotificationSettingsTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Look up user's database UUID
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.clerkId, clerkUserId),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get user's notification settings before removing
        const settings =
            await db.query.UserTelegramNotificationSettingsTable.findFirst({
                where: eq(
                    UserTelegramNotificationSettingsTable.userId,
                    user.id
                ),
            });

        if (!settings) {
            return NextResponse.json(
                { error: "No Telegram account linked" },
                { status: 404 }
            );
        }

        const telegramChatId = settings.telegramChatId;

        // Delete notification settings
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

        return NextResponse.json({
            success: true,
            message: "Telegram account unlinked successfully",
        });
    } catch (error) {
        console.error("Error unlinking Telegram:", error);
        return NextResponse.json(
            { error: "Failed to unlink account" },
            { status: 500 }
        );
    }
}
