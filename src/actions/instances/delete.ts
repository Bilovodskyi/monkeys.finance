"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

type DeleteResult =
    | { ok: true; id: string }
    | { ok: false; error: "unauthorized" | "invalidId" | "notFound" };

function isNonEmptyId(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function deleteInstance(instanceId: string): Promise<DeleteResult> {
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

    const deleted = await db
        .delete(InstanceTable)
        .where(and(eq(InstanceTable.id, instanceId), eq(InstanceTable.userId, userRow.id)))
        .returning({ id: InstanceTable.id });

    if (deleted.length === 0) {
        return { ok: false, error: "notFound" };
    }

    return { ok: true, id: deleted[0].id };
}


