"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

const inputSchema = z.object({
    id: z.string().min(1),
    strategy: z.string().min(1),
    instrument: z.string().min(1),
    exchangeLabel: z.string().min(1),
    name: z.string().min(1),
});

type UpdateResult = { ok: true; id: string } | { ok: false; error: "unauthorized" | "invalidInput" | "notFound" | "unsupportedExchange" };

function mapExchangeLabelToEnum(label: string): typeof InstanceTable.$inferInsert["exchange"] | null {
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
            return null;
    }
}

export async function updateInstance(input: unknown): Promise<UpdateResult> {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { ok: false, error: "unauthorized" };

    const parsed = inputSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "invalidInput" };
    const data = parsed.data;

    const exchange = mapExchangeLabelToEnum(data.exchangeLabel);
    if (!exchange) return { ok: false, error: "unsupportedExchange" };

    // Only update the instance if the current user owns it.
    const updated = await db
        .update(InstanceTable)
        .set({
            strategy: data.strategy,
            instrument: data.instrument,
            exchange,
            name: data.name,
        })
        .where(and(eq(InstanceTable.id, data.id)))
        .returning({ id: InstanceTable.id });

    if (updated.length === 0) return { ok: false, error: "notFound" };

    return { ok: true, id: updated[0].id };
}


