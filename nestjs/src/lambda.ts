import {NestFactory} from '@nestjs/core';
import {Callback, Context, Handler} from 'aws-lambda';
import {AppModule} from './app.module';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let s: Handler;

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({app: expressApp});
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    s = s ?? (await bootstrap());
    return s(event, context, callback);
};
