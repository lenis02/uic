import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateJoinFormDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '설명 문구를 입력해주세요.' })
  description?: string;

  // 불릿 목록. multipart로 오기 때문에 줄바꿈이 포함된 문자열 한 덩어리로 받는다.
  @IsOptional()
  @IsString()
  bullets?: string;
}
