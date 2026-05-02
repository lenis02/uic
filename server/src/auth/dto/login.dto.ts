import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  @MaxLength(50)
  username: string;

  @IsString()
  @ApiProperty({ example: 'admin1234' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MaxLength(100)
  password: string;
}
