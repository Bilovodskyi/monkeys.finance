"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export type InstanceRecord = {
    id: string;
    name: string;
    exchange: typeof InstanceTable.$inferSelect["exchange"];
    instrument: string;
    strategy: string;
    status: typeof InstanceTable.$inferSelect["status"];
    createdAt: Date | null;
    updatedAt: Date | null;
};

export async function getInstances(): Promise<InstanceRecord[]> {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await db.query.UserTable.findFirst({
        where: (t, { eq }) => eq(t.clerkId, clerkId)
    });
    if (!user) throw new Error("User not found");

    const rows = await db
        .select({
            id: InstanceTable.id,
            name: InstanceTable.name,
            exchange: InstanceTable.exchange,
            instrument: InstanceTable.instrument,
            strategy: InstanceTable.strategy,
            status: InstanceTable.status,
            createdAt: InstanceTable.createdAt,
            updatedAt: InstanceTable.updatedAt,
        })
        .from(InstanceTable)
        .where(eq(InstanceTable.userId, user.id))
        .orderBy(desc(InstanceTable.createdAt));

    return rows as InstanceRecord[];
}


