import {
    KMSClient,
    DecryptCommand,
    GenerateDataKeyCommand,
} from "@aws-sdk/client-kms";
import * as crypto from "crypto";

export interface KMSConfig {
    kmsKeyId: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}

export interface EncryptedCredentials {
    encryptedApiKey: string;
    encryptedApiSecret: string;
    encryptedDataKey: string;
}

/**
 * Create KMS client instance with explicit credentials
 */
function createKMSClient(config: KMSConfig): KMSClient {
    return new KMSClient({
        region: config.region || "us-west-2",
        credentials: config.accessKeyId && config.secretAccessKey
            ? {
                  accessKeyId: config.accessKeyId,
                  secretAccessKey: config.secretAccessKey,
              }
            : undefined,
    });
}

/**
 * Encrypt API credentials using AWS KMS envelope encryption
 */
export async function encryptApiCredentials(
    config: KMSConfig,
    apiKey: string,
    apiSecret: string
): Promise<EncryptedCredentials> {
    const kmsClient = createKMSClient(config);

    // Generate a data key from KMS
    const dataKeyCommand = new GenerateDataKeyCommand({
        KeyId: config.kmsKeyId,
        KeySpec: "AES_256",
    });

    const dataKeyResponse = await kmsClient.send(dataKeyCommand);

    if (!dataKeyResponse.Plaintext || !dataKeyResponse.CiphertextBlob) {
        throw new Error("Failed to generate data key");
    }

    // Use the plaintext data key to encrypt credentials
    const plaintextKey = Buffer.from(dataKeyResponse.Plaintext);

    // Encrypt API key
    const apiKeyIv = crypto.randomBytes(12);
    const apiKeyCipher = crypto.createCipheriv(
        "aes-256-gcm",
        plaintextKey,
        apiKeyIv
    );
    const encryptedApiKey = Buffer.concat([
        apiKeyCipher.update(apiKey, "utf8"),
        apiKeyCipher.final(),
    ]);
    const apiKeyAuthTag = apiKeyCipher.getAuthTag();

    // Encrypt API secret
    const apiSecretIv = crypto.randomBytes(12);
    const apiSecretCipher = crypto.createCipheriv(
        "aes-256-gcm",
        plaintextKey,
        apiSecretIv
    );
    const encryptedApiSecret = Buffer.concat([
        apiSecretCipher.update(apiSecret, "utf8"),
        apiSecretCipher.final(),
    ]);
    const apiSecretAuthTag = apiSecretCipher.getAuthTag();

    return {
        encryptedApiKey: Buffer.concat([
            apiKeyIv,
            apiKeyAuthTag,
            encryptedApiKey,
        ]).toString("base64"),
        encryptedApiSecret: Buffer.concat([
            apiSecretIv,
            apiSecretAuthTag,
            encryptedApiSecret,
        ]).toString("base64"),
        encryptedDataKey: Buffer.from(dataKeyResponse.CiphertextBlob).toString(
            "base64"
        ),
    };
}

/**
 * Decrypt API credentials
 */
export async function decryptApiCredentials(
    config: KMSConfig,
    encryptedApiKey: string,
    encryptedApiSecret: string,
    encryptedDataKey: string
): Promise<{ apiKey: string; apiSecret: string }> {
    const kmsClient = createKMSClient(config);

    // Decrypt the data key with KMS
    const decryptCommand = new DecryptCommand({
        CiphertextBlob: Buffer.from(encryptedDataKey, "base64"),
    });

    const decryptResponse = await kmsClient.send(decryptCommand);

    if (!decryptResponse.Plaintext) {
        throw new Error("Failed to decrypt data key");
    }

    const plaintextKey = Buffer.from(decryptResponse.Plaintext);

    // Decrypt API key
    const apiKeyBuffer = Buffer.from(encryptedApiKey, "base64");
    const apiKeyIv = apiKeyBuffer.subarray(0, 12);
    const apiKeyAuthTag = apiKeyBuffer.subarray(12, 28);
    const apiKeyEncrypted = apiKeyBuffer.subarray(28);

    const apiKeyDecipher = crypto.createDecipheriv(
        "aes-256-gcm",
        plaintextKey,
        apiKeyIv
    );
    apiKeyDecipher.setAuthTag(apiKeyAuthTag);
    const apiKey = Buffer.concat([
        apiKeyDecipher.update(apiKeyEncrypted),
        apiKeyDecipher.final(),
    ]).toString("utf8");

    // Decrypt API secret
    const apiSecretBuffer = Buffer.from(encryptedApiSecret, "base64");
    const apiSecretIv = apiSecretBuffer.subarray(0, 12);
    const apiSecretAuthTag = apiSecretBuffer.subarray(12, 28);
    const apiSecretEncrypted = apiSecretBuffer.subarray(28);

    const apiSecretDecipher = crypto.createDecipheriv(
        "aes-256-gcm",
        plaintextKey,
        apiSecretIv
    );
    apiSecretDecipher.setAuthTag(apiSecretAuthTag);
    const apiSecret = Buffer.concat([
        apiSecretDecipher.update(apiSecretEncrypted),
        apiSecretDecipher.final(),
    ]).toString("utf8");

    return { apiKey, apiSecret };
}
