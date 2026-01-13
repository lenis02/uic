import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  // JwtStrategy를 통과하지 못하면(토큰이 없거나 잘못됨) 자동으로 401 에러를 던집니다.

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // 토큰이 유효하지 않거나 사용자가 없는 경우
    if (err || !user) {
      throw (
        err || new UnauthorizedException('관리자 권한이 필요한 서비스입니다.')
      );
    }
    return user;
  }
}
