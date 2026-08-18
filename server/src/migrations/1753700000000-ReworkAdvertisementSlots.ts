import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 광고 배치 모델을 통째로 바꾼다.
 * 이전: 위치(top/bottom) 고정 띠 + 위치별 띠 높이(ad_placement)
 * 이후: 위치 고정형(섹션+위/아래) 또는 추적형(좌/우 여백) + 광고별 가로·세로 크기
 *
 * 이전 스키마는 광고가 한 건도 등록되기 전이라 그대로 갈아엎는다.
 */
export class ReworkAdvertisementSlots1753700000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS ad_placement`);
    await queryRunner.query(`DROP TABLE IF EXISTS advertisement`);

    await queryRunner.query(`
      CREATE TABLE advertisement (
        id          SERIAL PRIMARY KEY,
        type        VARCHAR   NOT NULL,
        section     VARCHAR,
        edge        VARCHAR,
        side        VARCHAR,
        width       INTEGER   NOT NULL,
        height      INTEGER   NOT NULL,
        "imageUrl"  VARCHAR   NOT NULL,
        "linkUrl"   VARCHAR,
        "altText"   VARCHAR   NOT NULL DEFAULT '',
        "isActive"  BOOLEAN   NOT NULL DEFAULT true,
        "sortOrder" INTEGER   NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE advertisement`);

    await queryRunner.query(`
      CREATE TABLE advertisement (
        id          SERIAL PRIMARY KEY,
        placement   VARCHAR   NOT NULL,
        "imageUrl"  VARCHAR   NOT NULL,
        "linkUrl"   VARCHAR,
        "altText"   VARCHAR   NOT NULL DEFAULT '',
        "isActive"  BOOLEAN   NOT NULL DEFAULT true,
        "sortOrder" INTEGER   NOT NULL DEFAULT 1,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE ad_placement (
        id          SERIAL PRIMARY KEY,
        placement   VARCHAR   NOT NULL UNIQUE,
        "barHeight" INTEGER   NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      INSERT INTO ad_placement (placement, "barHeight") VALUES ('top', 58), ('bottom', 66)
    `);
  }
}
