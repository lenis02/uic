import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdvertisementTables1753690000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // 위치별 기본 띠 높이. 핸드오프 규격(상단 58 / 하단 66)을 그대로 쓴다.
    await queryRunner.query(`
      INSERT INTO ad_placement (placement, "barHeight") VALUES
      ('top', 58),
      ('bottom', 66)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ad_placement`);
    await queryRunner.query(`DROP TABLE advertisement`);
  }
}
