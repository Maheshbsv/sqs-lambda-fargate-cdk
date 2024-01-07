import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SqsLambdaFargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** 
     * Assumptions
     * SQS_QUEUE_URL is available in Environment variable
     * DYNAMODB_TABLE is available in Environment variable
     * run-fargate lambda is deployed in same region as SQS and DynamoDB
     * run-fargate lambda is associated with SQS and DynamoDB and ECS access permissions
     * Test and validate on the cloud resources directly
     */
    new NodejsFunction(this, 'run-fargate', {
      entry: path.join(__dirname, "lambdas", "run-fargate", "index.ts"),
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      // Add necessary lambda config as needed
    });
  }
}
