import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
    UserTable,
    UserTelegramNotificationSettingsTable,
} from "@/drizzle/schema";

// GET current preferences
export async function GET(request: NextRequest) {
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

        const settings = await db
            .select({
                userId: UserTelegramNotificationSettingsTable.userId,
                telegramChatId:
                    UserTelegramNotificationSettingsTable.telegramChatId,
                telegramUsername:
                    UserTelegramNotificationSettingsTable.telegramUsername,
                instrument: UserTelegramNotificationSettingsTable.instrument,
                strategy: UserTelegramNotificationSettingsTable.strategy,
            })
            .from(UserTelegramNotificationSettingsTable)
            .where(eq(UserTelegramNotificationSettingsTable.userId, user.id));

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching preferences:", error);
        return NextResponse.json(
            { error: "Failed to fetch preferences" },
            { status: 500 }
        );
    }
}

// UPDATE preferences
export async function PUT(request: NextRequest) {
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

        const { instrument, strategy } = await request.json();

        // Validate input
        if (!instrument || !strategy) {
            return NextResponse.json(
                { error: "Instrument and strategy are required" },
                { status: 400 }
            );
        }

        // Check if user has notification settings
        const existingSettings =
            await db.query.UserTelegramNotificationSettingsTable.findFirst({
                where: eq(
                    UserTelegramNotificationSettingsTable.userId,
                    user.id
                ),
            });

        if (!existingSettings) {
            return NextResponse.json(
                {
                    error: "No notification settings found. Please link your Telegram account first.",
                },
                { status: 404 }
            );
        }

        // Update preferences
        await db
            .update(UserTelegramNotificationSettingsTable)
            .set({
                instrument,
                strategy,
                updatedAt: new Date(),
            })
            .where(eq(UserTelegramNotificationSettingsTable.userId, user.id));

        return NextResponse.json({
            success: true,
            message: "Preferences updated successfully!",
        });
    } catch (error) {
        console.error("Error updating preferences:", error);
        return NextResponse.json(
            { error: "Failed to update preferences" },
            { status: 500 }
        );
    }
}
