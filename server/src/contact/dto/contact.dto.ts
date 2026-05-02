import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ContactDto {
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @MaxLength(254)
  email: string;

  @IsNotEmpty({ message: '내용은 필수 입력 항목입니다.' })
  @IsString()
  @MaxLength(5000)
  message: string;
}
