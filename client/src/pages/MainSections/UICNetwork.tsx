import { useState } from 'react';
import { assets } from '../../../assets/assets';
import ViewAllModal from '../../components/ViewAllModal';

// 대학 정보 및 이미지
const universities = [
  { name: `가천대학교`, logo: 'logo_gachon' },
  { name: `가톨릭대학교`, logo: 'logo_catholic' },
  { name: `강남대학교`, logo: 'logo_kangnam' },
  { name: `강원대학교`, logo: 'logo_kangwon' },
  { name: `경기대학교`, logo: 'logo_kyonggi' },
  { name: `경북대학교`, logo: 'logo_kyungpook' },
  { name: `경상대학교`, logo: 'logo_gyeongsang' },
  { name: `경희대학교`, logo: 'logo_kyunghee' },
  { name: `광운대학교`, logo: 'logo_kwangwoon' },
  { name: `국립부경대학교`, logo: 'logo_pukyong' },
  { name: `국민대학교`, logo: 'logo_kookmin' },
  { name: `나사렛대학교`, logo: 'logo_nazarene' },
  { name: `단국대학교`, logo: 'logo_dankook' },
  { name: `덕성여자대학교`, logo: 'logo_duksung' },
  { name: `동국대학교`, logo: 'logo_dongguk' },
  { name: `동아대학교`, logo: 'logo_donga' },
  { name: `명지대학교`, logo: 'logo_myongji' },
  { name: `부산대학교`, logo: 'logo_pusan' },
  { name: `삼육대학교`, logo: 'logo_sahmyook' },
  { name: `상명대학교`, logo: 'logo_sangmyung' },
  { name: `서강대학교`, logo: 'logo_sogang' },
  { name: `서울시립대학교`, logo: 'logo_uos' },
  { name: `성신여자대학교`, logo: 'logo_sungshin' },
  { name: `세종대학교`, logo: 'logo_sejong' },
  { name: `수원대학교`, logo: 'logo_suwon' },
  { name: `숙명여자대학교`, logo: 'logo_sookmyung' },
  { name: `숭실대학교`, logo: 'logo_soongsil' },
  { name: `아주대학교`, logo: 'logo_ajou' },
  { name: `연세대학교`, logo: 'logo_yonsei' },
  { name: `영남대학교`, logo: 'logo_yeungnam' },
  { name: `원광대학교`, logo: 'logo_wonkwang' },
  { name: `인천대학교`, logo: 'logo_incheon' },
  { name: `인하대학교`, logo: 'logo_inha' },
  { name: `전남대학교`, logo: 'logo_chonnam' },
  { name: `조선대학교`, logo: 'logo_chosun' },
  { name: `중앙대학교`, logo: 'logo_chungang' },
  { name: `창원대학교`, logo: 'logo_changwon' },
  { name: `충남대학교`, logo: 'logo_chungnam' },
  { name: `충북대학교`, logo: 'logo_chungbuk' },
  { name: `한국외국어대학교`, logo: 'logo_hufs' },
  { name: `한성대학교`, logo: 'logo_hansung' },
  { name: `한양대학교`, logo: 'logo_hanyang' },
  { name: `한남대학교`, logo: 'logo_hannam' },
  { name: `협성대학교`, logo: 'logo_hyupsung' },
  { name: `홍익대학교`, logo: 'logo_hongik' },
  { name: `연합동아리 SURI` },
  { name: `연합동아리 바이시그널` },
  { name: `연합동아리 위닝펀드` },
  { name: `연합동아리 GROWTH` },
  { name: `연합동아리 PRIDE` },
  { name: `연합동아리 STONKS` },
  { name: `연합동아리 S.E.S` },
  { name: `연합동아리 UFIC` },
];

// 로고 자체가 밝은 색이라 흰 배경에서는 보이지 않는 대학들
const LIGHT_LOGOS = [
  '가톨릭대학교',
  '경기대학교',
  '한성대학교',
  '홍익대학교',
];

type University = (typeof universities)[number];

const UniversityTile = ({ uni }: { uni: University }) => {
  const logoSrc = uni.logo ? assets[uni.logo as keyof typeof assets] : null;
  const needsDarkBg = LIGHT_LOGOS.includes(uni.name);

  return (
    <div className="uic-tile h-full">
      <div className={`uic-logo ${needsDarkBg ? 'uic-logo-dark' : ''}`}>
        {logoSrc ? (
          <img src={logoSrc} alt={uni.name} loading="lazy" />
        ) : (
          <span
            className={`text-[9px] font-bold text-center px-1 break-keep ${
              needsDarkBg ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {uni.name}
          </span>
        )}
      </div>
      <span className="text-[13px] font-semibold text-gray-200 text-center leading-tight break-keep">
        {uni.name}
      </span>
    </div>
  );
};

const UICNetwork = () => {
  const [showAll, setShowAll] = useState(false);

  // 끊김 없는 무한 루프를 위해 목록을 두 번 이어붙인다.
  // 트랙 전체가 정확히 2배이므로 -50%까지 이동하면 시작 지점과 동일해진다.
  const marqueeItems = [...universities, ...universities];

  return (
    <section
      id="network"
      className="relative min-h-screen w-full md:snap-start flex flex-col items-center justify-center overflow-hidden px-6 py-24 md:py-28"
    >
      {/* 헤더 */}
      <div className="text-center mb-8 md:mb-11 shrink-0 z-10">
        <span className="block text-[13px] md:text-sm font-semibold tracking-[0.3em] text-purple-300 mb-3">
          NETWORK
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug break-keep">
          전국 <span className="text-purple-300">53개</span> 대학 투자동아리와
          함께
        </h2>
      </div>

      {/* 1행 무한 마퀴 */}
      <div className="uic-marqwrap z-10">
        <div className="uic-marq-track uic-marq-net">
          {marqueeItems.map((uni, idx) => (
            <div key={`${uni.name}-${idx}`} className="uic-marq-item">
              <UniversityTile uni={uni} />
            </div>
          ))}
        </div>
      </div>

      {/* 전체 보기 */}
      <button
        type="button"
        className="uic-viewall mt-8 md:mt-10 z-10"
        onClick={() => setShowAll(true)}
      >
        전체 대학 한번에 보기
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {showAll && (
        <ViewAllModal
          label="NETWORK"
          labelColor="#c4b5fd"
          title="전국 53개 대학 투자동아리"
          onClose={() => setShowAll(false)}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-[18px]">
            {universities.map((uni) => (
              <UniversityTile key={uni.name} uni={uni} />
            ))}
          </div>
        </ViewAllModal>
      )}
    </section>
  );
};

export default UICNetwork;
