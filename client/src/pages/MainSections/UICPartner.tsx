import { useState } from 'react';
import { assets } from '../../../assets/assets'; // assets 경로 확인 필요

// 협력사 데이터 (예시 데이터, 실제 데이터로 교체 필요)
const partners = [
  { name: '삼성증권', logo: 'logo_uic_color' }, // logo 이름은 assets에 정의된 키값이어야 함
  { name: '한국투자증권', logo: 'logo_uic_color' },
  { name: '미래에셋증권', logo: 'logo_uic_color' },
  { name: 'NH투자증권', logo: 'logo_uic_color' },
  { name: 'KB증권', logo: 'logo_uic_color' },
  { name: '신한투자증권', logo: 'logo_uic_color' },
  { name: '하나증권', logo: 'logo_uic_color' },
  { name: '키움증권', logo: 'logo_uic_color' },
  { name: '대신증권', logo: 'logo_uic_color' },
  { name: '메리츠증권', logo: 'logo_uic_color' },
  { name: '토스증권', logo: 'logo_uic_color' },
  { name: '카카오페이증권', logo: 'logo_kakao' },
  // ... 추가 협력사
];

const UICPartner = () => {
  // 레이아웃 설정: 대학보다 크게 보여주기 위해 개수를 줄임
  const ROWS = 2; // 세로 2줄
  const COLS = 4; // 가로 4칸 (모바일은 CSS로 조정)
  const ITEMS_PER_PAGE = ROWS * COLS;

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);

  const currentData = partners.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <section
      id="partner"
      className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden"
    >
      {/* 배경 장식 (선택 사항: Network와 구분하기 위해 미세한 배경 추가 가능) */}
      <div className="absolute inset-0 bg-gray-50/10 z-0 pointer-events-none" />

      {/* 메인 컨테이너 */}
      <div className="relative z-10 mt-20 md:mt-32 bg-white w-[90%] h-[60%] md:h-[65%] max-w-[1300px] max-h-[850px] rounded-[40px] shadow-2xl flex flex-col items-center justify-between p-6 md:p-12 border border-gray-100">
        {/* 헤더: NETWORK와 폰트 스타일은 같지만 내용은 다르게 */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            PARTNERS
          </h2>
          <p className="text-sm md:text-base mt-3 text-gray-500 font-medium">
            UIC와 함께 금융의 미래를 만들어가는 든든한 파트너
          </p>
        </div>

        {/* 메인 영역 (좌우 화살표 + 그리드) */}
        <div className="flex-1 w-full flex items-center justify-between gap-2 md:gap-8">
          {/* 왼쪽 화살표 */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-full hover:bg-gray-100 transition-all ${
              currentPage === 0
                ? 'opacity-0 cursor-default'
                : 'opacity-100 cursor-pointer text-gray-600'
            }`}
          >
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* 파트너 그리드 영역 */}
          <div className="flex-1 h-full w-full flex items-center justify-center">
            {/* Grid 변경점:
               - grid-cols-2 (모바일), grid-cols-4 (PC) : 대학(7열)보다 훨씬 큼
               - gap-4 : 간격을 넓게 시원하게 배치
            */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-8 w-full max-w-5xl h-full content-center">
              {currentData.map((partner) => {
                // 로고 이미지 매핑
                const logoSrc = partner.logo
                  ? assets[partner.logo as keyof typeof assets]
                  : null;

                return (
                  <div
                    key={partner.name}
                    className="
                      group relative w-full h-24 md:h-32 
                      bg-white border border-gray-200 rounded-2xl 
                      flex items-center justify-center p-4 
                      transition-all duration-300 
                      hover:shadow-lg hover:border-purple-200 hover:-translate-y-1
                    "
                  >
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={partner.name}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      // 로고 없을 시 텍스트 표시
                      <span className="text-gray-400 font-bold text-sm md:text-lg group-hover:text-purple-700 transition-colors">
                        {partner.name}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* 빈 공간 채우기 (페이지 마지막에 아이템이 부족할 경우 레이아웃 유지) */}
              {Array.from({ length: ITEMS_PER_PAGE - currentData.length }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="hidden md:block w-full h-32"
                  />
                )
              )}
            </div>
          </div>

          {/* 오른쪽 화살표 */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-2 rounded-full hover:bg-gray-100 transition-all ${
              currentPage === totalPages - 1
                ? 'opacity-0 cursor-default'
                : 'opacity-100 cursor-pointer text-gray-600'
            }`}
          >
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 페이지 인디케이터 (Bar 스타일로 변경하여 차별화) */}
        <div className="flex gap-2 mt-6 md:mt-8">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentPage
                  ? 'w-8 bg-purple-600' // 활성화되면 길어짐
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UICPartner;
