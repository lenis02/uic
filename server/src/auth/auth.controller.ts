import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // 로그인 성공 시 201 대신 200 OK 반환
  async login(@Body() loginDto: LoginDto) {
    // Service의 login 함수 호출
    return await this.authService.login(loginDto.username, loginDto.password);
  }

  // 로그아웃은 보통 프론트엔드에서 토큰을 지우는 것으로 처리하지만,
  // 필요하다면 나중에 블랙리스트 로직을 추가할 수 있습니다.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: '로그아웃 되었습니다.' };
  }
}
