import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 노출 순서를 수동 sortOrder에서 "대학 → 연합동아리, 각 그룹 내 이름 가나다순"으로 바꾼다.
 * 기존 데이터의 연합동아리 여부는 이름 접두사로만 구분되어 있었다.
 */
export class AddNetworkCategoryDropSortOrder1753670000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE network
      ADD COLUMN category VARCHAR NOT NULL DEFAULT 'university'
    `);
    await queryRunner.query(`
      UPDATE network SET category = 'club' WHERE name LIKE '연합동아리%'
    `);

    await queryRunner.query(`ALTER TABLE network DROP COLUMN "sortOrder"`);
    await queryRunner.query(`ALTER TABLE partner DROP COLUMN "sortOrder"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE partner ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`
      ALTER TABLE network ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0
    `);
    await queryRunner.query(`ALTER TABLE network DROP COLUMN category`);
  }
}
