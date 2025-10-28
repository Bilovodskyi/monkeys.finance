import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import {
    UserTable,
    UserTelegramNotificationSettingsTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const dynamoDb = DynamoDBDocumentClient.from(
    new DynamoDBClient({
        region: process.env.AWS_REGION || "us-west-2",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID_DYNAMODB!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_DYNAMODB!,
        },
    })
);

export async function POST(request: NextRequest) {
    try {
        // 1. Verify user is authenticated
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Look up user's database UUID using Clerk ID
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.clerkId, clerkUserId),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 3. Get token from request
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json(
                { error: "Token required" },
                { status: 400 }
            );
        }

        // 4. Retrieve token from DynamoDB
        const tokenData = await dynamoDb.send(
            new GetCommand({
                TableName: "TelegramLinkTokens",
                Key: { token },
            })
        );

        if (!tokenData.Item) {
            return NextResponse.json(
                {
                    error: "Invalid or expired token. Please try again.",
                },
                { status: 400 }
            );
        }

        const { chatId, username } = tokenData.Item;

        // 5. Check if this user already has Telegram linked
        const existingSettings =
            await db.query.UserTelegramNotificationSettingsTable.findFirst({
                where: eq(
                    UserTelegramNotificationSettingsTable.userId,
                    user.id
                ),
            });

        if (existingSettings) {
            return NextResponse.json(
                {
                    error: "Your account already has Telegram linked.",
                },
                { status: 409 }
            );
        }

        // 6. Create Telegram notification settings record
        await db.insert(UserTelegramNotificationSettingsTable).values({
            userId: user.id, // Use database UUID, not Clerk ID
            telegramChatId: chatId,
            telegramUsername: username || null,
            instrument: null, // Default null, will be set later by user
            strategy: null, // Default null, will be set later by user
        });

        // 7. Delete used token
        await dynamoDb.send(
            new DeleteCommand({
                TableName: "TelegramLinkTokens",
                Key: { token },
            })
        );

        // 8. Send confirmation message on Telegram
        const botToken = process.env.TELEGRAM_BOT_TOKEN!;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: "✅ *Account linked successfully!*\n\nYou can now configure your notification preferences on the website.",
                parse_mode: "Markdown",
            }),
        });

        return NextResponse.json({
            success: true,
            message: "Telegram account linked successfully!",
            username: username || "User",
        });
    } catch (error) {
        console.error("Error linking Telegram:", error);
        return NextResponse.json(
            {
                error: "Failed to link account. Please try again.",
            },
            { status: 500 }
        );
    }
}
