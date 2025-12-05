"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { userCredentials } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { encryptApiCredentials } from "@/services/apiKeyManager";
import { Exchange } from "@/types/global";

export type SaveCredentialsInput = {
    exchange: string;
    apiKey?: string;
    apiSecret?: string;
    passphrase?: string;
};

export type SaveCredentialsResult =
    | { ok: true }
    | {
          ok: false;
          error:
              | "unauthorized"
              | "userNotFound"
              | "invalidInput"
              | "encryptionFailed"
              | "saveFailed"
              | "unexpected";
      };

/**
 * Save (or update) encrypted API credentials for a user's exchange.
 * Uses AWS KMS envelope encryption to securely store credentials.
 */
export async function saveCredentials(
    input: SaveCredentialsInput
): Promise<SaveCredentialsResult> {
    try {
        // 1. Authenticate user
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return { ok: false, error: "unauthorized" };
        }

        // 2. Get user from database
        const user = await db.query.UserTable.findFirst({
            where: (t, { eq }) => eq(t.clerkId, clerkId),
        });

        if (!user) {
            console.log("[saveCredentials] User not found for clerkId:", clerkId);
            return { ok: false, error: "userNotFound" };
        }

        // 3. Validate input
        if (!input.exchange) {
            return { ok: false, error: "invalidInput" };
        }

        // If neither apiKey nor apiSecret provided, nothing to save
        if (!input.apiKey && !input.apiSecret) {
            return { ok: false, error: "invalidInput" };
        }

        // 4. Get KMS configuration from environment
        const kmsKeyId = process.env.AWS_KMS_KEY_ID;
        const kmsAccessKey = process.env.AWS_KMS_ACCESS_KEY;
        const kmsSecretKey = process.env.AWS_KMS_SECRET_ACCESS_KEY;
        const awsRegion = process.env.AWS_REGION || "eu-west-1";

        if (!kmsKeyId || !kmsAccessKey || !kmsSecretKey) {
            console.error("[saveCredentials] Missing KMS configuration");
            return { ok: false, error: "encryptionFailed" };
        }

        // 5. Check if credentials already exist for this exchange
        const exchangeEnum = input.exchange.toLowerCase() as Exchange;

        const existingCredentials = await db.query.userCredentials.findFirst({
            where: (t, { eq, and }) =>
                and(eq(t.userId, user.id), eq(t.exchange, exchangeEnum)),
        });

        // 6. Determine what to encrypt
        const finalApiKey = input.apiKey || "";
        const finalApiSecret = input.apiSecret || "";

        // If updating partial credentials, we need to decrypt existing ones first
        if (existingCredentials) {
            // If only updating one field, we need both for encryption
            // For now, we'll require both fields to be provided
            // TODO: In the future, we could decrypt existing and merge
            if (!input.apiKey || !input.apiSecret) {
                return {
                    ok: false,
                    error: "invalidInput", // Require both for now
                };
            }
        }

        // Validate we have both credentials
        if (!finalApiKey || !finalApiSecret) {
            return { ok: false, error: "invalidInput" };
        }

        // 7. Encrypt credentials using KMS
        let encrypted;
        // TODO: Add passphrase encryption
        try {
            encrypted = await encryptApiCredentials(
                {
                    kmsKeyId,
                    region: awsRegion,
                    accessKeyId: kmsAccessKey,
                    secretAccessKey: kmsSecretKey,
                },
                finalApiKey,
                finalApiSecret,
            );
        } catch (error) {
            console.error("[saveCredentials] Encryption failed:", error);
            return { ok: false, error: "encryptionFailed" };
        }

        // 8. Store encrypted credentials in database
        try {
            const encMeta = JSON.stringify({
                encryptedDataKey: encrypted.encryptedDataKey,
                version: "1",
            });

            if (existingCredentials) {
                // Update existing credentials
                await db
                    .update(userCredentials)
                    .set({
                        encKey: encrypted.encryptedApiKey,
                        encSecret: encrypted.encryptedApiSecret,
                        encPassphrase: input.passphrase || null,
                        encMeta,
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(userCredentials.userId, user.id),
                            eq(userCredentials.exchange, exchangeEnum)
                        )
                    );
            } else {
                // Insert new credentials
                await db.insert(userCredentials).values({
                    userId: user.id,
                    exchange: exchangeEnum,
                    encKey: encrypted.encryptedApiKey,
                    encSecret: encrypted.encryptedApiSecret,
                    encPassphrase: input.passphrase || null,
                    encMeta,
                });
            }

            return { ok: true };
        } catch (error) {
            console.error("[saveCredentials] Database save failed:", error);
            return { ok: false, error: "saveFailed" };
        }
    } catch (error) {
        console.error("[saveCredentials] Unexpected error:", error);
        return { ok: false, error: "unexpected" };
    }
}
