// Vercel 서버리스 함수 진입점.
//
// 이 파일만 순수 CommonJS로 둔다. NestJS 코드는 전부 `nest build`가 컴파일한
// dist/ 를 통해 불러온다. Vercel 기본 TS 처리기(esbuild)는 nest-cli.json의
// @nestjs/swagger 플러그인과 emitDecoratorMetadata를 적용하지 않아
// NestJS 의존성 주입이 깨지기 때문이다.

const { getServer } = require('../dist/serverless');

module.exports = async (req, res) => {
  const server = await getServer();
  server(req, res);
};
