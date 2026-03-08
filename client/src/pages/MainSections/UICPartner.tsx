import { useState } from 'react';
import { assets } from '../../../assets/assets';

const partners = [
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

const UICPartner = () => {
  const ROWS = 2;
  const COLS = 4;
  const ITEMS_PER_PAGE = ROWS * COLS;

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);

  const currentData = partners.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <section
      id="partner"
      className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gray-50/10 z-0 pointer-events-none" />

      <div className="relative z-10 mt-20 md:mt-32 bg-white w-[85%] md:w-[85%] h-[60%] md:h-[65%] max-w-[1300px] max-h-[850px] rounded-[30px] md:rounded-[40px] shadow-2xl flex flex-col items-center justify-between p-5 md:p-12 border border-gray-100">
        <div className="text-center mb-4 md:mb-6 shrink-0">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            PARTNERS
          </h2>
          <p className="text-xs md:text-base mt-2 md:mt-3 text-gray-500 font-medium">
            UIC와 함께 금융의 미래를 만들어가는 든든한 파트너
          </p>
        </div>

        <div className="flex-1 w-full flex items-center justify-between gap-1 md:gap-8 min-h-0">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`p-1 md:p-2 shrink-0 rounded-full hover:bg-gray-100 transition-all z-10 ${
              currentPage === 0
                ? 'opacity-0 cursor-default'
                : 'opacity-100 cursor-pointer text-gray-600'
            }`}
          >
            <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* [변경점 1] md:overflow-hidden -> lg:overflow-hidden으로 변경 (태블릿에서도 스크롤 허용) */}
          <div className="flex-1 h-full w-full flex items-center justify-center overflow-y-auto lg:overflow-hidden scrollbar-hide py-2 lg:py-0">
            
            {/* [변경점 2] md:grid-cols-3 적용! (태블릿 3열, 데스크탑 4열) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 gap-3 md:gap-6 lg:gap-8 w-full max-w-5xl m-auto content-start lg:content-center">
              {currentData.map((partner) => {
                const logoSrc = partner.logo
                  ? assets[partner.logo as keyof typeof assets]
                  : null;

                return (
                  <div
                    key={partner.name}
                    className="
                      group relative w-full aspect-[2/1]
                      bg-white border border-gray-200 rounded-xl md:rounded-2xl 
                      flex items-center justify-center p-3 md:p-5 
                      transition-all duration-300 
                      hover:shadow-lg hover:border-purple-200 hover:-translate-y-1
                    "
                  >
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={partner.name}
                        className="w-full h-full object-contain filter group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <span className="text-gray-400 font-bold text-xs md:text-sm group-hover:text-purple-700 transition-colors text-center break-keep">
                        {partner.name}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* [변경점 3] 빈 공간 채우기는 레이아웃이 완벽히 고정되는 데스크탑(lg)에서만 활성화 */}
              {Array.from({ length: ITEMS_PER_PAGE - currentData.length }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="hidden lg:block w-full aspect-[2/1]"
                  />
                ),
              )}
            </div>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-1 md:p-2 shrink-0 rounded-full hover:bg-gray-100 transition-all z-10 ${
              currentPage === totalPages - 1
                ? 'opacity-0 cursor-default'
                : 'opacity-100 cursor-pointer text-gray-600'
            }`}
          >
            <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mt-4 md:mt-8 shrink-0">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentPage
                  ? 'w-6 md:w-8 bg-purple-600'
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