"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { Exchange } from "@/types/global";

/**
 * Get the count of instances for a specific exchange
 */
export async function getInstanceCountByExchange(
    exchange: string
): Promise<number> {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return 0;

        const user = await db.query.UserTable.findFirst({
            where: (t, { eq }) => eq(t.clerkId, clerkId),
        });

        if (!user) return 0;

        const exchangeEnum = exchange.toLowerCase() as Exchange

        const instances = await db
            .select()
            .from(InstanceTable)
            .where(
                and(
                    eq(InstanceTable.userId, user.id),
                    eq(InstanceTable.exchange, exchangeEnum)
                )
            );

        return instances.length;
    } catch (error) {
        console.error("[getInstanceCountByExchange] Error:", error);
        return 0;
    }
}
