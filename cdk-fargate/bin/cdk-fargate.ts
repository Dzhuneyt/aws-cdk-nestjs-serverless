#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {NestJsWithFargateDeployment} from '../lib/nest-js-with-fargate-deployment';

const app = new cdk.App();
new NestJsWithFargateDeployment(app, 'NestJsWithFargateDeployment', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});
