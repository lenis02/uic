import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // 정적 파일 접근을 위해 NestExpressApplication 타입을 명시합니다.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. CORS 설정: 프론트엔드(React 등)에서 백엔드 API에 접근할 수 있게 허용
  app.enableCors({
    origin: true, // 실제 배포 시에는 ['http://your-site.com'] 으로 제한하는 것이 좋습니다.
    credentials: true,
  });

  // 2. 전역 파이프 설정: DTO에 작성한 @IsNotEmpty 등을 활성화
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성은 거름
      forbidNonWhitelisted: true, // DTO에 없는 속성이 오면 에러 발생
      transform: true, // 요청 데이터를 DTO 타입으로 자동 변환
    }),
  );

  // 3. 정적 파일 서빙: 브라우저에서 'http://localhost:3000/uploads/...'로 파일 접근 가능
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Swagger 설정 시작
  const config = new DocumentBuilder()
    .setTitle('UIC Backend API')
    .setDescription('UIC 동아리 웹사이트 관리자 및 데이터 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 버튼 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // http://localhost:3000/docs 로 접속

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
