import { useState } from 'react';
import { assets } from '../../../assets/assets';

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

const UICNetwork = () => {
  const ROWS = 3;
  const COLS = 7;
  const ITEMS_PER_PAGE = ROWS * COLS;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(universities.length / ITEMS_PER_PAGE);

  const currentData = universities.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <section
      id="network"
      className="relative h-screen w-full md:snap-start flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 mt-20 md:mt-32 bg-white w-[70%] md:w-[85%] h-[60%] md:h-[65%] max-w-[1200px] max-h-[850px] rounded-[24px] md:rounded-[40px] shadow-xl flex flex-col items-center justify-between p-4 md:p-6 lg:p-10">
        {/* 헤더 */}
        <div className="text-center mb-4 shrink-0">
          <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold text-gray-900">
            NETWORK
          </h2>
          <p className="text-xs md:text-sm mt-1 text-gray-500">
            전국 53개 대학 투자동아리와 함께하는 UIC
          </p>
        </div>

        {/* =========================================
            [1] 모바일 레이아웃 (카드 제거 -> 4열 심플 그리드 세로 스크롤)
            ========================================= */}
        <div className="flex md:hidden flex-1 w-full overflow-y-auto scrollbar-hide py-2 px-1">
          <div className="grid grid-cols-3 gap-y-8 gap-x-2 w-full content-start">
            {universities.map((uni) => {
              const isDarkBg = [
                  '가톨릭대학교',
                  '경기대학교',
                  '한성대학교',
                  '홍익대학교',
                ].includes(uni.name);
              const logoSrc = uni.logo
                ? assets[uni.logo as keyof typeof assets]
                : null;

              return (
                <div
                  key={uni.name}
                  className="flex flex-col items-center gap-1.5 w-full"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkBg ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={uni.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[8px] font-bold text-center text-gray-500 px-1 break-keep">
                        {uni.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-600 font-medium w-full max-w-[4.5rem] mx-auto text-center leading-tight line-clamp-2 break-words">
                    {uni.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================
            [2] 데스크탑 레이아웃 (페이징 버튼 + 3x7 그리드)
            ========================================= */}
        <div className="hidden md:flex flex-1 w-full items-center justify-between min-h-0">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-2 shrink-0 transition-opacity ${
              currentPage === 0
                ? 'opacity-20 select-none'
                : 'opacity-100 cursor-pointer'
            }`}
          >
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex-1 h-full w-full flex items-center justify-center overflow-hidden">
            <div className="grid grid-cols-7 grid-rows-3 w-full h-full content-center items-center justify-items-center m-auto gap-y-6">
              {currentData.map((uni) => {
                const isDarkBg = [
                  '가톨릭대학교',
                  '경기대학교',
                  '한성대학교',
                  '홍익대학교',
                ].includes(uni.name);
                const logoSrc = uni.logo
                  ? assets[uni.logo as keyof typeof assets]
                  : null;

                return (
                  <div
                    key={uni.name}
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm ${isDarkBg ? 'bg-gray-900' : 'bg-gray-100'} transform-gpu hover:-translate-y-1 transition-transform`}
                    >
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={uni.name}
                          loading="lazy"
                          className="w-full h-full object-contain p-3"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-center text-gray-600 px-1 break-keep">
                          {uni.name}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-700 font-semibold w-full max-w-[5.75rem] text-center leading-snug line-clamp-2 break-words">
                      {uni.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-2 shrink-0 transition-opacity ${
              currentPage === totalPages - 1
                ? 'opacity-20 select-none'
                : 'opacity-100 cursor-pointer'
            }`}
          >
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 데스크탑 전용 페이지 인디케이터 */}
        <div className="hidden md:flex gap-3 mt-4 -mb-2 shrink-0">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${
                idx === currentPage ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UICNetwork;
