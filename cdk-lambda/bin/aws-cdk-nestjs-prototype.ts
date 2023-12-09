#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AwsCdkNestjsPrototypeStack} from '../lib/aws-cdk-nestjs-prototype-stack';

const app = new cdk.App();
new AwsCdkNestjsPrototypeStack(app, 'AwsCdkNestjsPrototypeStack', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});
