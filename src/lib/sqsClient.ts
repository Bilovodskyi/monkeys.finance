import "server-only";
import { SQSClient } from "@aws-sdk/client-sqs";

// Export the queue URL for instance health checks
export const INSTANCE_HEALTH_QUEUE_URL =
    process.env.SQS_INSTANCE_HEALTH_QUEUE_URL || "";

// Lazy initialization to avoid errors during module analysis
let _sqsClient: SQSClient | null = null;

function getSqsClient(): SQSClient {
    if (_sqsClient) return _sqsClient;

    const accessKey = process.env.AWS_SQS_ACCESS_KEY;
    const secretKey = process.env.AWS_SQS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;

    if (!accessKey || !secretKey || !region) {
        throw new Error(
            "Missing AWS SQS credentials. Required: AWS_SQS_ACCESS_KEY, AWS_SQS_SECRET_ACCESS_KEY, AWS_REGION"
        );
    }

    _sqsClient = new SQSClient({
        region,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
    });

    return _sqsClient;
}

export default getSqsClient;

