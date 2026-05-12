import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePopupTable1715000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE popup (
        id          SERIAL PRIMARY KEY,
        "imageUrl"  VARCHAR   NOT NULL,
        "linkUrl"   VARCHAR,
        "startDate" TIMESTAMP NOT NULL,
        "endDate"   TIMESTAMP NOT NULL,
        "isActive"  BOOLEAN   NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE popup`);
  }
}
