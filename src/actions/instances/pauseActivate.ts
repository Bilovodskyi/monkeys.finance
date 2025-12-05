"use server";

import { db } from "@/drizzle/db";
import { and, eq, sql } from "drizzle-orm";
import { InstanceTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";

type PauseActivateResult = { ok: true; instanceId: string; newStatus: "active" | "paused" } | { ok: false; error: string };

function isNonEmptyId(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function pauseActivate(instanceId: string): Promise<PauseActivateResult> {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { ok: false, error: "unauthorized" };

    if (!isNonEmptyId(instanceId)) {
        return { ok: false, error: "invalidId" };
    }

    const userRow = await db.query.UserTable.findFirst({
        where: (userTable) => eq(userTable.clerkId, clerkId),
        columns: { id: true },
    });
    if (!userRow) return { ok: false, error: "unauthorized" };

    // Toggle status atomically and only for instances owned by this user.
    const updated = await db
        .update(InstanceTable)
        .set({
            status: sql`CASE WHEN ${InstanceTable.status} = 'active'::status THEN 'paused'::status ELSE 'active'::status END`,
            updatedAt: sql`now()`,
        })
        .where(and(eq(InstanceTable.id, instanceId), eq(InstanceTable.userId, userRow.id)))
        .returning({ id: InstanceTable.id, status: InstanceTable.status });

    if (updated.length === 0) {
        return { ok: false, error: "notFound" };
    }

    const { id, status } = updated[0];

    return { ok: true, instanceId: id, newStatus: status as "active" | "paused" };
}