"use server";

import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export type InstanceData = {
    id: string;
    userId: string;
    name: string;
    exchange: string;
    instrument: string;
    strategy: string;
    positionSizeUSDT: string;
    isTestnet: boolean;
    status: "active" | "paused";
    createdAt: Date;
};

/**
 * Server action to fetch all instances for a given user ID.
 */
export async function fetchUserInstances(userId: string): Promise<InstanceData[]> {
    const instances = await db
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
        .where(eq(InstanceTable.userId, userId))
        .orderBy(desc(InstanceTable.createdAt));

    return instances;
}
