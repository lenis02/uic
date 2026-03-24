import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const env = configService.get<string>('NODE_ENV');
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret && env === 'production') {
      throw new UnauthorizedException(
        'JWT secret is not configured for production.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret ?? 'dev-only-jwt-secret',
    });
  }

  // 2. 토큰 검증이 성공하면 실행되는 함수
  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
