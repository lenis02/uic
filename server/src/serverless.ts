import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './setup-app';

/**
 * Vercel 서버리스 함수용 부트스트랩.
 *
 * main.ts는 app.listen()으로 포트를 점유하지만 서버리스에서는 포트를 열 수 없다.
 * 대신 Express 인스턴스를 만들어 Nest를 그 위에 얹고, 초기화만 끝낸 뒤
 * 해당 Express 인스턴스를 요청 핸들러로 넘긴다.
 *
 * 인스턴스는 모듈 스코프에 캐싱된다. 같은 컨테이너로 들어오는 후속 요청은
 * 부트스트랩을 건너뛰므로 콜드스타트 비용은 컨테이너당 한 번만 발생한다.
 */
let cached: Promise<Express> | null = null;

async function bootstrap(): Promise<Express> {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  configureApp(app);
  await app.init();
  return expressApp;
}

export function getServer(): Promise<Express> {
  if (!cached) {
    cached = bootstrap();
  }
  return cached;
}
