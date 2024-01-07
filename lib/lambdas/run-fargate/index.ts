import { SQSEvent } from 'aws-lambda';
import { SQS, ECS } from "aws-sdk";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const sqs = new SQS({ region: process.env.REGION });

const ddbClient = DynamoDBDocumentClient.from(new DynamoDB({}));
const ecs = new ECS({ region: process.env.REGION });
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE ?? "";
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL ?? "";

export async function handler(event: SQSEvent) {

    for (let record of event.Records) {

        // Get data from SQS message
        const { userId, taskDefinition } = JSON.parse(record.body);

        // Update DynamoDB status to Pending
        await ddbClient.send(new UpdateCommand({
            TableName: DYNAMODB_TABLE,
            Key: { userId },
            UpdateExpression: "set status = :status",
            ExpressionAttributeValues: {
                ":status": "Pending"
            }
        }))

        // Start ECS task
        await ecs.runTask({
            cluster: process.env.ECS_CLUSTER,
            taskDefinition: taskDefinition,
            count: 1
        }).promise();

        // Delete SQS message 
        await sqs.deleteMessage({
            QueueUrl: SQS_QUEUE_URL,
            ReceiptHandle: record.receiptHandle
        }).promise();

        // Update Item status to Completed
        await ddbClient.send(new UpdateCommand({
            TableName: DYNAMODB_TABLE,
            Key: { userId },
            UpdateExpression: "set status = :status",
            ExpressionAttributeValues: {
                ":status": "Complete"
            }
        }))

    }
}
