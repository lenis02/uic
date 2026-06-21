import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV');
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret && env === 'production') {
          throw new Error(
            'JWT_SECRET must be set in production environment.',
          );
        }

        if (!jwtSecret) {
          console.warn(
            '⚠️  JWT_SECRET is not set — falling back to an insecure dev secret. Do NOT use this in production.',
          );
        }

        return {
          secret: jwtSecret ?? 'dev-only-jwt-secret',
          signOptions: { expiresIn: '1d', algorithm: 'HS256' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // 다른 모듈에서 인증이 필요할 때 사용
})
export class AuthModule {}
