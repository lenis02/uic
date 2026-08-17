import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAdPlacementDto {
  // 허용 범위는 위치마다 달라서(BAR_HEIGHT_LIMITS) 서비스에서 검사한다.
  @Type(() => Number)
  @IsInt({ message: '띠 높이는 정수로 입력해주세요.' })
  barHeight: number;
}
