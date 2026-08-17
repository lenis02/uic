import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReorderActivityDto {
  // 화면에 보이는 순서대로의 활동 id 목록. 이 순서대로 sortOrder를 1부터 다시 매긴다.
  @IsArray()
  @ArrayNotEmpty({ message: '정렬할 활동 목록이 비어 있습니다.' })
  @IsInt({ each: true })
  ids: number[];
}
