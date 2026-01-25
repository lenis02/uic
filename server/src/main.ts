import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 👇 [추가 1] express에서 json, urlencoded를 가져옵니다.
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. CORS 설정 (완벽합니다)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 👇 [추가 2] 파일 업로드를 위해 요청 크기 제한을 늘립니다 (필수!)
  // 이게 없으면 조금만 큰 PDF를 올려도 서버가 튕겨냅니다.
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // 2. 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. 정적 파일 서빙 (Cloudinary를 쓰더라도 일단 놔둬도 무방합니다)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('UIC Backend API')
    .setDescription('UIC 동아리 웹사이트 관리자 및 데이터 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
