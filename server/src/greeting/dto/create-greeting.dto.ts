import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGreetingDto {
  @IsString()
  @IsNotEmpty({ message: '직책을 입력해주세요 (예: President)' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: '성함을 입력해주세요' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '직함을 입력해주세요' })
  fullRole: string;

  @IsString()
  @IsNotEmpty({ message: '한 줄 인사를 입력해주세요' })
  greeting: string;

  @IsString()
  @IsNotEmpty({ message: '인사말 본문을 입력해주세요' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: '멋있는 말 한마디만 입력해주세요' })
  quote: string;

  @IsOptional()
  order?: number;
}
