import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const isProduction = configureApp(app);

  const port = Number(app.get(ConfigService).get<string>('PORT') ?? 3000);
  await app.listen(port);
  if (!isProduction) {
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
}
bootstrap();
