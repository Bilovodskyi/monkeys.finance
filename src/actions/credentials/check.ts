"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { userCredentials } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export type ExchangeCredentialStatus = {
    apiKey: boolean;
    apiSecret: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CredentialsStatus = {
    [exchange: string]: ExchangeCredentialStatus;
};

/**
 * Checks which exchanges the user has credentials configured for.
 * Returns a mapping of exchange names to credential status.
 * 
 * Security: Only returns boolean flags, never actual encrypted credentials.
 */
export async function getCredentialsStatus(): Promise<CredentialsStatus> {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        throw new Error("Unauthorized");
    }

    // Get the user from the database
    const user = await db.query.UserTable.findFirst({
        where: (t, { eq }) => eq(t.clerkId, clerkId),
    });

    if (!user) {
        console.log("[getCredentialsStatus] User not found for clerkId:", clerkId);
        return {};
    }

    // Query all credentials for this user
    const credentials = await db
        .select({
            exchange: userCredentials.exchange,
            encKey: userCredentials.encKey,
            encSecret: userCredentials.encSecret,
            createdAt: userCredentials.createdAt,
            updatedAt: userCredentials.updatedAt,
        })
        .from(userCredentials)
        .where(eq(userCredentials.userId, user.id));

    // Build the status object
    const status: CredentialsStatus = {};
    
    for (const cred of credentials) {
        status[cred.exchange] = {
            apiKey: !!cred.encKey && cred.encKey.length > 0,
            apiSecret: !!cred.encSecret && cred.encSecret.length > 0,
            createdAt: cred.createdAt,
            updatedAt: cred.updatedAt,
        };
    }

    return status;
}
