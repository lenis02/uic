import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivityJoinFormTables1753680000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE activity (
        id            SERIAL PRIMARY KEY,
        title         VARCHAR   NOT NULL,
        description   TEXT      NOT NULL,
        "imageUrl"    VARCHAR,
        "sortOrder"   INTEGER   NOT NULL DEFAULT 1,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE join_form (
        id            SERIAL PRIMARY KEY,
        type          VARCHAR   NOT NULL UNIQUE,
        description   TEXT      NOT NULL,
        bullets       TEXT      NOT NULL,
        "fileUrl"     VARCHAR,
        "fileName"    VARCHAR,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // 하드코딩되어 있던 기존 내용을 그대로 옮겨 심는다.
    // 이 시드가 없으면 배포 직후 활동/지원 페이지가 빈 화면이 된다.
    await queryRunner.query(`
      INSERT INTO activity (title, description, "sortOrder") VALUES
      ('정기총회', $1, 1),
      ('연합세션', $2, 2),
      ('투자콘서트', $3, 3),
      ('직무콘서트', $4, 4)
    `, [
      [
        '월 1회 정기적으로 총회 진행',
        '소속원 니즈 바탕의 연사 초청 (투교협)',
        '학술 교류 및 친목 도모',
        'UIC 소속 동아리 회원 전원 참여',
      ].join('\n'),
      [
        'UIC 소속 동아리들 간의 소규모 학술 교류',
        '3개 이상의 학교 혹은 동아리 간 진행',
        '주식, 증권, 금융 관련 자유 주제 발표 및 토론',
      ].join('\n'),
      [
        '매년 개최되는 UIC 최대 규모의 리서치 대회',
        '금융투자협회 회장상 수여',
        '<span class="font-black">UIC 소속 동아리 회원만</span> 참여 가능한 전통적 대회 (13회차)',
        '투자 업계 명사 강연 및 CFA 현직자 심사 진행',
      ].join('\n'),
      [
        'CFA 한국협회 X UIC 금융권 직무 토크쇼 개최',
        'IB, WM, 리서치 등 다양한 직무의 현직자 멘토링',
        '자유로운 분위기 속에서 현직자와의 직접 소통 가능',
      ].join('\n'),
    ]);

    // fileUrl은 client/public/files에 이미 올라가 있는 정적 파일 경로.
    // 관리자가 새 파일을 업로드하면 Cloudinary URL로 교체된다.
    await queryRunner.query(`
      INSERT INTO join_form (type, description, bullets, "fileUrl", "fileName") VALUES
      ('club', $1, $2, $3, $4),
      ('individual', $5, $6, $7, $8),
      ('joint', $9, $10, $11, $12)
    `, [
      '동아리 가입을 위한 단체 지원 프로세스입니다.',
      ['PDF 형식 변환 제출 준수', '활동 계획서 및 동아리 소개서 필수'].join('\n'),
      '/files/UIC 동아리 및 학회 가입 등록원 (2026).pptx',
      'UIC 동아리 및 학회 가입 등록원 (2026).pptx',

      '신규 회원을 위한 개인 지원 프로세스입니다.',
      ['PDF 형식 변환 제출 준수', '주 단위로 합격 여부 발표'].join('\n'),
      '/files/UIC 개인회원 가입 등록원 (2026).pptx',
      'UIC 개인회원 가입 등록원 (2026).pptx',

      'UIC 소속 동아리·학회 간 교류를 위한 연합세션 참가 프로세스입니다.',
      ['PDF 형식 변환 제출 준수', '리서치·운용보고서 등 활동 자료 첨부 필수'].join('\n'),
      '/files/UIC 연합세션 참가 신청서 (2026).pptx',
      'UIC 연합세션 참가 신청서 (2026).pptx',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE join_form`);
    await queryRunner.query(`DROP TABLE activity`);
  }
}
