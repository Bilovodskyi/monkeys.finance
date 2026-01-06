"use server";

import { db } from "@/drizzle/db";
import { InstanceHealthTable } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export type InstanceHealthStatus = {
    instanceId: string;
    status: "CHECKING" | "CONNECTED" | "NEEDS_ACTION" | "ERROR";
    errorCode: string | null;
    lastRequestedAt: Date | null;
    lastCheckedAt: Date | null;
} | null;

export type InstanceHealthMap = Record<string, InstanceHealthStatus>;

/**
 * Server action to fetch health status for a single instance.
 * Returns null if no health record exists.
 */
export async function fetchInstanceHealth(
    instanceId: string
): Promise<InstanceHealthStatus> {
    const health = await db.query.InstanceHealthTable.findFirst({
        where: eq(InstanceHealthTable.instanceId, instanceId),
    });

    if (!health) return null;

    return {
        instanceId: health.instanceId,
        status: health.status,
        errorCode: health.errorCode,
        lastRequestedAt: health.lastRequestedAt,
        lastCheckedAt: health.lastCheckedAt,
    };
}

/**
 * Server action to fetch health statuses for multiple instances.
 * Returns a map of instanceId -> health status (null if not found).
 */
export async function fetchInstancesHealth(
    instanceIds: string[]
): Promise<InstanceHealthMap> {
    if (instanceIds.length === 0) return {};

    const healthRecords = await db
        .select({
            instanceId: InstanceHealthTable.instanceId,
            status: InstanceHealthTable.status,
            errorCode: InstanceHealthTable.errorCode,
            lastRequestedAt: InstanceHealthTable.lastRequestedAt,
            lastCheckedAt: InstanceHealthTable.lastCheckedAt,
        })
        .from(InstanceHealthTable)
        .where(inArray(InstanceHealthTable.instanceId, instanceIds));

    const healthMap: InstanceHealthMap = {};
    
    // Initialize all with null
    for (const id of instanceIds) {
        healthMap[id] = null;
    }
    
    // Populate with found records
    for (const record of healthRecords) {
        healthMap[record.instanceId] = {
            instanceId: record.instanceId,
            status: record.status,
            errorCode: record.errorCode,
            lastRequestedAt: record.lastRequestedAt,
            lastCheckedAt: record.lastCheckedAt,
        };
    }

    return healthMap;
}
