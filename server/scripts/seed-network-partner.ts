/**
 * 기존에 client/assets 번들로 하드코딩되어 있던 참여 대학·협력사 목록을
 * Cloudinary + DB로 한 번 옮기기 위한 일회성 스크립트.
 *
 *   cd server && npx ts-node scripts/seed-network-partner.ts
 *
 * 이미 데이터가 있으면 중단한다. 다시 밀어넣으려면 --force 로 기존 행을 지우고 실행.
 */
import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { AppDataSource } from '../src/data-source';
import { Network } from '../src/network/entities/network.entity';
import { Partner } from '../src/partner/entities/partner.entity';

dotenv.config();

const ASSETS_DIR = path.resolve(__dirname, '../../client/assets');

// UICNetwork.tsx에 하드코딩되어 있던 목록. logo가 없는 항목은 이름만 노출된다.
const universities: { name: string; logo?: string }[] = [
  { name: '가천대학교', logo: 'logo_gachon' },
  { name: '가톨릭대학교', logo: 'logo_catholic' },
  { name: '강남대학교', logo: 'logo_kangnam' },
  { name: '강원대학교', logo: 'logo_kangwon' },
  { name: '경기대학교', logo: 'logo_kyonggi' },
  { name: '경북대학교', logo: 'logo_kyungpook' },
  { name: '경상대학교', logo: 'logo_gyeongsang' },
  { name: '경희대학교', logo: 'logo_kyunghee' },
  { name: '광운대학교', logo: 'logo_kwangwoon' },
  { name: '국립부경대학교', logo: 'logo_pukyong' },
  { name: '국민대학교', logo: 'logo_kookmin' },
  { name: '나사렛대학교', logo: 'logo_nazarene' },
  { name: '단국대학교', logo: 'logo_dankook' },
  { name: '덕성여자대학교', logo: 'logo_duksung' },
  { name: '동국대학교', logo: 'logo_dongguk' },
  { name: '동아대학교', logo: 'logo_donga' },
  { name: '명지대학교', logo: 'logo_myongji' },
  { name: '부산대학교', logo: 'logo_pusan' },
  { name: '삼육대학교', logo: 'logo_sahmyook' },
  { name: '상명대학교', logo: 'logo_sangmyung' },
  { name: '서강대학교', logo: 'logo_sogang' },
  { name: '서울시립대학교', logo: 'logo_uos' },
  { name: '성신여자대학교', logo: 'logo_sungshin' },
  { name: '세종대학교', logo: 'logo_sejong' },
  { name: '수원대학교', logo: 'logo_suwon' },
  { name: '숙명여자대학교', logo: 'logo_sookmyung' },
  { name: '숭실대학교', logo: 'logo_soongsil' },
  { name: '아주대학교', logo: 'logo_ajou' },
  { name: '연세대학교', logo: 'logo_yonsei' },
  { name: '영남대학교', logo: 'logo_yeungnam' },
  { name: '원광대학교', logo: 'logo_wonkwang' },
  { name: '인천대학교', logo: 'logo_incheon' },
  { name: '인하대학교', logo: 'logo_inha' },
  { name: '전남대학교', logo: 'logo_chonnam' },
  { name: '조선대학교', logo: 'logo_chosun' },
  { name: '중앙대학교', logo: 'logo_chungang' },
  { name: '창원대학교', logo: 'logo_changwon' },
  { name: '충남대학교', logo: 'logo_chungnam' },
  { name: '충북대학교', logo: 'logo_chungbuk' },
  { name: '한국외국어대학교', logo: 'logo_hufs' },
  { name: '한성대학교', logo: 'logo_hansung' },
  { name: '한양대학교', logo: 'logo_hanyang' },
  { name: '한남대학교', logo: 'logo_hannam' },
  { name: '협성대학교', logo: 'logo_hyupsung' },
  { name: '홍익대학교', logo: 'logo_hongik' },
  { name: '연합동아리 SURI' },
  { name: '연합동아리 바이시그널' },
  { name: '연합동아리 위닝펀드' },
  { name: '연합동아리 GROWTH' },
  { name: '연합동아리 PRIDE' },
  { name: '연합동아리 STONKS' },
  { name: '연합동아리 S.E.S' },
  { name: '연합동아리 UFIC' },
];

// 로고 자체가 밝은 색이라 흰 배경에서는 보이지 않는 대학들
const LIGHT_LOGOS = new Set([
  '가톨릭대학교',
  '경기대학교',
  '한성대학교',
  '홍익대학교',
]);

// UICPartner.tsx에 하드코딩되어 있던 목록
const partners: { name: string; logo: string }[] = [
  { name: '삼성증권', logo: 'logo_coop0' },
  { name: '한국투자증권', logo: 'logo_coop1' },
  { name: '미래에셋증권', logo: 'logo_coop2' },
  { name: 'NH투자증권', logo: 'logo_coop3' },
  { name: 'KB증권', logo: 'logo_coop4' },
  { name: '신한투자증권', logo: 'logo_coop5' },
  { name: '하나증권', logo: 'logo_coop6' },
  { name: '키움증권', logo: 'logo_coop7' },
  { name: '대신증권', logo: 'logo_coop8' },
  { name: '메리츠증권', logo: 'logo_coop9' },
  { name: '토스증권', logo: 'logo_coop10' },
  { name: '카카오페이증권', logo: 'logo_coop11' },
  { name: '카', logo: 'logo_coop12' },
  { name: '카카오', logo: 'logo_coop13' },
];

/** 확장자가 제각각이라 파일명 앞부분으로 찾는다. */
function findAssetPath(logoKey: string): string {
  const match = fs
    .readdirSync(ASSETS_DIR)
    .find((f) => f.slice(0, f.lastIndexOf('.')) === logoKey);
  if (!match) throw new Error(`로고 파일을 찾을 수 없습니다: ${logoKey}`);
  return path.join(ASSETS_DIR, match);
}

async function uploadLogo(logoKey: string): Promise<string> {
  const result = await cloudinary.uploader.upload(findAssetPath(logoKey), {
    folder: 'uic_logos',
    resource_type: 'image',
    public_id: logoKey,
    overwrite: true,
    access_mode: 'public',
  });
  return result.secure_url;
}

async function main() {
  const force = process.argv.includes('--force');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  await AppDataSource.initialize();
  const networkRepo = AppDataSource.getRepository(Network);
  const partnerRepo = AppDataSource.getRepository(Partner);

  const existing = (await networkRepo.count()) + (await partnerRepo.count());
  if (existing > 0) {
    if (!force) {
      console.error(
        `이미 ${existing}건의 데이터가 있습니다. 다시 넣으려면 --force 를 붙여주세요.`,
      );
      await AppDataSource.destroy();
      process.exit(1);
    }
    console.log('--force: 기존 network/partner 데이터를 삭제합니다.');
    await networkRepo.delete({});
    await partnerRepo.delete({});
  }

  for (const [index, uni] of universities.entries()) {
    const logoUrl = uni.logo ? await uploadLogo(uni.logo) : null;
    await networkRepo.save(
      networkRepo.create({
        name: uni.name,
        // 기존 목록에서 연합동아리는 이름 접두사로만 구분되어 있었다.
        category: uni.name.startsWith('연합동아리') ? 'club' : 'university',
        logoUrl,
        darkBg: LIGHT_LOGOS.has(uni.name),
      }),
    );
    console.log(`[network ${index + 1}/${universities.length}] ${uni.name}`);
  }

  for (const [index, partner] of partners.entries()) {
    const logoUrl = await uploadLogo(partner.logo);
    await partnerRepo.save(
      partnerRepo.create({ name: partner.name, logoUrl }),
    );
    console.log(`[partner ${index + 1}/${partners.length}] ${partner.name}`);
  }

  await AppDataSource.destroy();
  console.log('완료되었습니다.');
}

main().catch(async (error) => {
  console.error(error);
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
