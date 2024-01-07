#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqsLambdaFargateStack } from '../lib/sqs-lambda-fargate-stack';

const app = new cdk.App();
new SqsLambdaFargateStack(app, 'SqsLambdaFargateStack', {
  
});