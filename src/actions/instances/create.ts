"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { hasEntitlement } from "@/lib/has-entitelment-client";

const inputSchema = z.object({
    strategy: z.string().min(1),
    instrument: z.string().min(1),
    exchangeLabel: z
        .string()
        .min(1)
        .transform((val) => val.toLowerCase())
        .pipe(
            z.enum([
                "binance",
                "kraken",
                "coinbase",
                "okx",
                "binanceus",
                "bybit",
            ])
        ),
    name: z.string().min(1),
    positionSizeUSDT: z.string().min(1),
    isTestnet: z.boolean().optional(),
});

type CreateResult =
    | { ok: true; id: string }
    | {
          ok: false;
          error:
              | "unauthorized"
              | "invalidInput"
              | "userNotFound"
              | "subscriptionEnded"
              | "failedToCreate"
              | "unexpected";
      };

export async function createInstance(input: unknown): Promise<CreateResult> {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { ok: false, error: "unauthorized" };

        const parseResult = inputSchema.safeParse(input);
        if (!parseResult.success) return { ok: false, error: "invalidInput" };
        const data = parseResult.data;

        const user = await db.query.UserTable.findFirst({
            where: (userTable) => eq(userTable.clerkId, clerkId),
        });
        if (!user) return { ok: false, error: "userNotFound" };

        if (!hasEntitlement(user)) {
            return { ok: false, error: "subscriptionEnded" };
        }

        const [inserted] = await db
            .insert(InstanceTable)
            .values({
                userId: user.id,
                name: data.name,
                exchange: data.exchangeLabel,
                instrument: data.instrument,
                strategy: data.strategy,
                positionSizeUSDT: data.positionSizeUSDT,
                isTestnet: data.isTestnet ?? false,
            })
            .returning({ id: InstanceTable.id });

        if (!inserted) {
            return { ok: false, error: "failedToCreate" };
        }

        return { ok: true, id: inserted.id };
    } catch (error: unknown) {
        console.error("[createInstance] Unexpected error:", error);
        return { ok: false, error: "unexpected" };
    }
}
