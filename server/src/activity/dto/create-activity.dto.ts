import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty({ message: '활동 제목을 입력해주세요.' })
  title: string;

  // 불릿 목록. multipart로 오기 때문에 줄바꿈이 포함된 문자열 한 덩어리로 받는다.
  @IsString()
  @IsNotEmpty({ message: '활동 설명을 한 줄 이상 입력해주세요.' })
  description: string;
}
