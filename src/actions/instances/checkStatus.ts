"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InstanceTable, InstanceHealthTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import getSqsClient, { INSTANCE_HEALTH_QUEUE_URL } from "@/lib/sqsClient";

const RATE_LIMIT_HOURS = 1;

type CheckResult =
    | { ok: true; status: "queued" | "rate_limited"; message: string }
    | {
          ok: false;
          error:
              | "unauthorized"
              | "instance_not_found"
              | "sqs_error"
              | "unexpected";
      };

export async function checkInstanceStatus(
    instanceId: string,
    forceCheck: boolean = false
): Promise<CheckResult> {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return { ok: false, error: "unauthorized" };

        // Verify instance exists and belongs to user
        const instance = await db.query.InstanceTable.findFirst({
            where: eq(InstanceTable.id, instanceId),
            with: { user: true },
        });

        if (!instance || instance.user.clerkId !== clerkId) {
            return { ok: false, error: "instance_not_found" };
        }

        // Check rate limiting (skip if forceCheck is true - for new instances)
        if (!forceCheck) {
            const health = await db.query.InstanceHealthTable.findFirst({
                where: eq(InstanceHealthTable.instanceId, instanceId),
            });

            // if (health?.lastRequestedAt) {
            //     const hourAgo = new Date();
            //     hourAgo.setHours(hourAgo.getHours() - RATE_LIMIT_HOURS);

            //     if (health.lastRequestedAt > hourAgo) {
            //         const nextCheckTime = new Date(health.lastRequestedAt);
            //         nextCheckTime.setHours(
            //             nextCheckTime.getHours() + RATE_LIMIT_HOURS
            //         );
            //         return {
            //             ok: true,
            //             status: "rate_limited",
            //             message: `Please wait until ${nextCheckTime.toISOString()}`,
            //         };
            //     }
            // }
        }

        // Upsert health record with CHECKING status
        await db
            .insert(InstanceHealthTable)
            .values({
                instanceId,
                status: "CHECKING",
                lastRequestedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: InstanceHealthTable.instanceId,
                set: {
                    status: "CHECKING",
                    lastRequestedAt: new Date(),
                    updatedAt: new Date(),
                },
            });

        // Send message to SQS
        const command = new SendMessageCommand({
            QueueUrl: INSTANCE_HEALTH_QUEUE_URL,
            MessageBody: JSON.stringify({
                instanceId,
                userId: instance.userId,
                exchange: instance.exchange,
                timestamp: new Date().toISOString(),
            }),
        });

        await getSqsClient().send(command);

        return {
            ok: true,
            status: "queued",
            message: "Health check request queued",
        };
    } catch (error: unknown) {
        console.error("[checkInstanceStatus] Error:", error);
        if (error instanceof Error && error.name.includes("SQS")) {
            return { ok: false, error: "sqs_error" };
        }
        return { ok: false, error: "unexpected" };
    }
}
