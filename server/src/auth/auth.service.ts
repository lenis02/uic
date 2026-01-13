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
      throw new UnauthorizedException('관리자 계정을 찾을 수 없습니다.');
    }

    // 암호화된 비밀번호 비교
    const isMatch = await bcrypt.compare(pass, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
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
    const salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(newPass, salt);

    return this.adminRepository.save(admin);
  }

  // auth.service.ts 내부
  async onModuleInit() {
    const adminCount = await this.adminRepository.count();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('uic1234@', salt); // 초기 비밀번호
      await this.adminRepository.save({
        username: 'master',
        password: hashedPassword,
      });
      console.log('초기 관리자 계정이 생성되었습니다: admin / admin1234');
    }
  }
}
