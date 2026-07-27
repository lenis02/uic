import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNetworkPartnerTables1753660000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE network (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR   NOT NULL,
        "logoUrl"   VARCHAR,
        "darkBg"    BOOLEAN   NOT NULL DEFAULT false,
        "sortOrder" INTEGER   NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE partner (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR   NOT NULL,
        "logoUrl"   VARCHAR,
        "sortOrder" INTEGER   NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE partner`);
    await queryRunner.query(`DROP TABLE network`);
  }
}
