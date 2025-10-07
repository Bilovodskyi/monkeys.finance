"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const inputSchema = z.object({
    strategy: z.string().min(1),
    instrument: z.string().min(1),
    exchangeLabel: z.string().min(1),
    name: z.string().min(1)
});

function mapExchangeLabelToEnum(label: string): typeof InstanceTable.$inferInsert["exchange"] {
    const normalized = label.trim().toLowerCase();
    switch (normalized) {
        case "binance":
            return "binance";
        case "kraken":
            return "kraken";
        case "coinbase":
            return "coinbase";
        case "okx":
            return "okx";
        case "binanceus":
            return "binanceus";
        case "bybit":
            return "bybit";
        default:
            throw new Error("Unsupported exchange");
    }
}

export async function createInstance(input: unknown) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const data = inputSchema.parse(input);

    const user = await db.query.UserTable.findFirst({
        where: (userTable) => eq(userTable.clerkId, clerkId)
    });
    if (!user) throw new Error("User not found");

    const exchange = mapExchangeLabelToEnum(data.exchangeLabel);

    const [inserted] = await db.insert(InstanceTable).values({
        userId: user.id,
        name: data.name,
        exchange,
        instrument: data.instrument,
        strategy: data.strategy,
    }).returning({ id: InstanceTable.id });

    return { id: inserted.id };
}


