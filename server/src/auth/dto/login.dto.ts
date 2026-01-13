import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'admin' }) // Swagger에 나타나게 함
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  username: string;

  @IsString()
  @ApiProperty({ example: 'admin1234' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
