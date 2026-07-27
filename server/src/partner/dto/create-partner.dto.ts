import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty({ message: '협력사 이름을 입력해주세요.' })
  name: string;
}
