"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import type { InstanceRecord } from "@/types/instance";

export async function getInstances(): Promise<InstanceRecord[]> {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await db.query.UserTable.findFirst({
        where: (t, { eq }) => eq(t.clerkId, clerkId),
    });
    if (!user) {
        console.log("[getInstances] User not found for clerkId:", clerkId);
        return [];
    }

    const rows = await db
        .select({
            id: InstanceTable.id,
            userId: InstanceTable.userId,
            name: InstanceTable.name,
            exchange: InstanceTable.exchange,
            instrument: InstanceTable.instrument,
            strategy: InstanceTable.strategy,
            positionSizeUSDT: InstanceTable.positionSizeUSDT,
            isTestnet: InstanceTable.isTestnet,
            status: InstanceTable.status,
            createdAt: InstanceTable.createdAt,
        })
        .from(InstanceTable)
        .where(eq(InstanceTable.userId, user.id))
        .orderBy(desc(InstanceTable.createdAt));

    return rows;
}
