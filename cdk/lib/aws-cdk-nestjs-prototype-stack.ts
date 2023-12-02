import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaRestApi, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkNestjsPrototypeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new LambdaRestApi(this, 'ApiGateway', {
            handler: new NodejsFunction(this, 'Lambda', {
                entry: path.resolve(__dirname, '../dist/main.js'),
            }),
        })
    }
}
