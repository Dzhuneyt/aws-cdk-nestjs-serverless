import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {AssetCode, Code, Runtime} from "aws-cdk-lib/aws-lambda";

export class AwsCdkNestjsPrototypeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const fn = new lambda.Function(this, 'Function', {
            runtime: Runtime.NODEJS_18_X,
            code: Code.fromAsset(path.resolve(__dirname, '../../nestjs/')),
            handler: 'dist/lambda.handler',
            timeout: cdk.Duration.seconds(30),
        })
        // const fn2 = new NodejsFunction(this, 'NodejsFunction', {
        //     entry: path.resolve(__dirname, '../../nestjs/src/lambda.ts'),
        //     projectRoot: path.resolve(__dirname, '../../'),
        //     bundling: {
        //         externalModules: [
        //             "@nestjs/microservices",
        //             "@nestjs/websockets/socket-module",
        //             "class-transformer",
        //             "class-validator",
        //         ],
        //     },
        // });
        new LambdaRestApi(this, 'ApiGateway', {
            handler: fn,
        })
    }
}
