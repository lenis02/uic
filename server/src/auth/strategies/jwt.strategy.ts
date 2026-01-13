import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. 헤더의 Authorization: Bearer <token> 에서 토큰 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 만료된 토큰은 거절
      secretOrKey: 'YOUR_SECRET_KEY', // AuthModule과 동일한 키 사용
    });
  }

  // 2. 토큰 검증이 성공하면 실행되는 함수
  async validate(payload: any) {
    // 로그인 시 담았던 payload (sub: id, username: username)
    // 이 반환값은 자동으로 request.user에 담기게 됩니다.
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
