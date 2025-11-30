// src/actions/telegram/status.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import {
    UserTable,
    UserTelegramNotificationSettingsTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function checkTelegramLinked(): Promise<boolean> {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        return false;
    }

    const user = await db.query.UserTable.findFirst({
        where: eq(UserTable.clerkId, clerkUserId),
    });

    if (!user) {
        return false;
    }

    const telegramAccount =
        await db.query.UserTelegramNotificationSettingsTable.findFirst({
            where: eq(UserTelegramNotificationSettingsTable.userId, user.id),
        });

    return !!telegramAccount;
}
