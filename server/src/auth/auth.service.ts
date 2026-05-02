import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  // 1. 관리자 로그인
  async login(username: string, pass: string) {
    const admin = await this.adminRepository.findOne({ where: { username } });

    if (!admin) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // 암호화된 비밀번호 비교
    const isMatch = await bcrypt.compare(pass, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    // 마지막 로그인 시간 업데이트
    admin.lastLogin = new Date();
    await this.adminRepository.save(admin);

    // JWT 토큰 페이로드 생성
    const payload = { username: admin.username, sub: admin.id, role: 'admin' };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 2. 비밀번호 변경 (관리자 전용)
  async changePassword(adminId: number, newPass: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException('해당 관리자를 찾을 수 없습니다.');
    }

    // 새 비밀번호 암호화
    const salt = await bcrypt.genSalt(12);
    admin.password = await bcrypt.hash(newPass, salt);

    return this.adminRepository.save(admin);
  }

  // auth.service.ts 내부
  async onModuleInit() {
    const adminCount = await this.adminRepository.count();
    if (adminCount === 0) {
      const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME;
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

      if (!defaultUsername || !defaultPassword) {
        console.warn(
          'No admin account exists and default admin credentials are not configured.',
        );
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      await this.adminRepository.save({
        username: defaultUsername,
        password: hashedPassword,
      });
      console.log('Initial admin account created from environment variables.');
    }
  }
}
