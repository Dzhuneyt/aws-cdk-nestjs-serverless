import * as cdk from 'aws-cdk-lib';
import {CfnOutput, Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {InstanceClass, InstanceSize, InstanceType, NatInstanceProvider, Vpc} from "aws-cdk-lib/aws-ec2";
import {Cluster, ContainerImage, FargateService, FargateTaskDefinition, LogDriver, Protocol} from "aws-cdk-lib/aws-ecs";
import {
    ApplicationListener,
    ApplicationLoadBalancer,
    ApplicationProtocol,
    ListenerAction
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {DockerImageAsset} from "aws-cdk-lib/aws-ecr-assets";
import * as path from "node:path";

export class NestJsWithFargateDeployment extends cdk.Stack {
    private cluster: Cluster;
    private vpc: Vpc;
    private alb: ApplicationLoadBalancer;
    private listener: ApplicationListener;

    constructor(private scope: Construct, private id: string, private props?: cdk.StackProps) {
        super(scope, id, props);

        this.createBaseInfrastructure();

        const taskDefinition = new FargateTaskDefinition(this, 'TaskDefinition', {
            memoryLimitMiB: 512,
            cpu: 256,
        })
        // taskDefinition.addContainer('nginx', {
        //     image: ContainerImage.fromRegistry('nginx:latest'),
        //     portMappings: [{containerPort: 80}],
        //     logging: LogDriver.awsLogs({streamPrefix: 'nginx'}),
        // })
        taskDefinition.addContainer('nestjs', {
            image: ContainerImage.fromDockerImageAsset(new DockerImageAsset(this, 'NestJSImage', {
                directory: path.resolve(__dirname, '../../nestjs'),
                file: 'Dockerfile-ecs',
            })),
            portMappings: [{containerPort: 3000, protocol: Protocol.TCP}],
            logging: LogDriver.awsLogs({streamPrefix: 'nestjs'}),
        })
        const service = new FargateService(this, 'Service', {
            cluster: this.cluster,
            taskDefinition,
            desiredCount: 1,
        });
        service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 2,
        }).scaleOnMemoryUtilization('MemoryUtilization', {targetUtilizationPercent: 50})

        this.listener.addTargets('nestjs', {
            port: 3000,
            protocol: ApplicationProtocol.HTTP,
            targets: [service],
            healthCheck: {
                path: '/',
                port: '3000',
                interval: cdk.Duration.seconds(5),
                timeout: cdk.Duration.seconds(4),
                healthyThresholdCount: 2,
                unhealthyThresholdCount: 5,
                healthyHttpCodes: '200-299',
            },
        })
    }

    private createBaseInfrastructure() {
        const infrastructureStack = new Stack(this.scope, 'InfrastructureStack', {
            env: this.props?.env,
        })

        this.vpc = new Vpc(infrastructureStack, 'VPC', {
            maxAzs: 2,
            natGateways: 1,
            natGatewayProvider: NatInstanceProvider.instance({
                instanceType: InstanceType.of(InstanceClass.T3A, InstanceSize.MICRO),
            })
        })

        this.cluster = new Cluster(infrastructureStack, 'Cluster', {
            vpc: this.vpc,
            enableFargateCapacityProviders: true,
        });

        this.alb = new ApplicationLoadBalancer(this, 'ALB', {
            vpc: this.vpc,
            internetFacing: true,
        });

        new CfnOutput(this.alb, 'URL', {
            value: this.alb.loadBalancerDnsName,
        })
        this.listener = this.alb.addListener('http', {
            protocol: ApplicationProtocol.HTTP,
            open: true,
            defaultAction: ListenerAction.fixedResponse(200),
        })
    }
}
