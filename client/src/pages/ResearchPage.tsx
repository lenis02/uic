import { useState, useMemo } from 'react';
import { assets } from '../../assets/assets';
import FooterBar from '../components/FooterBar';

// 샘플 데이터
const dummyReports = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: [
    '2024년 하반기 반도체 산업 전망: AI가 이끄는 슈퍼사이클',
    '전기차 시장의 캐즘(Chasm) 극복 시나리오 분석',
    '글로벌 헬스케어 트렌드: 비만 치료제의 부상',
    '생성형 AI 밸류체인 심층 분석 보고서',
    '국내 방산 기업 수출 모멘텀 점검',
    '엔터테인먼트 산업: K-POP의 글로벌 확장성',
    '재생에너지 정책 변화에 따른 태양광 산업 전망',
    '자율주행 기술의 현주소와 미래 투자 전략',
    '핀테크 산업의 규제 혁신과 기회',
    '우주 항공 산업: New Space 시대의 도래',
    '메타버스: 과장된 거품인가, 미래의 인터넷인가',
    'ESG 경영: 기업 가치 평가의 새로운 기준',
  ][i],
  author: [
    '김민수',
    '이서연',
    '박준호',
    '최지훈',
    '정다은',
    '강현우',
    '윤서아',
    '임도현',
    '한지민',
    '송민호',
    '류수정',
    '오지훈',
  ][i],
  date: `2024.0${9 - Math.floor(i / 2)}.1${i % 9}`,
  thumbnail: assets.logo_uic,
  fileUrl: '#',
}));

const ResearchPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const availableMonths = useMemo(() => {
    const months = dummyReports.map((item) => item.date.substring(0, 7));
    const uniqueMonths = Array.from(new Set(months)).sort((a, b) =>
      b.localeCompare(a)
    );
    return ['All', ...uniqueMonths];
  }, []);

  const filteredData = dummyReports.filter((item) => {
    const matchesTab = activeTab === 'All' || item.date.startsWith(activeTab);
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-white pt-32 pb-10">
      <img
        src={assets.bg_research}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex flex-col mb-3">
        {/* 전체 컨테이너: 사이드바 대신 상단 레이아웃 사용 */}
        <div className="flex flex-col w-full h-full bg-black/40 backdrop-blur-xl p-8 md:p-12 overflow-hidden border border-white/5 shadow-2xl rounded-sm">
          {/* [상단 영역] 타이틀 & 검색바 */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-fit">
              <h1 className="text-3xl font-bold tracking-tight text-white/80">
                Investment Concert
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-transparent mt-3" />
            </div>

            <div className="relative w-full md:w-[320px] group">
              <input
                type="text"
                placeholder="Search Reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-3 pl-5 pr-12 text-sm text-white/70 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-300"
              />
              <svg
                className="absolute right-4 top-3.5 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </header>

          {/* [중단 영역] Timeline 가로 탭 (스크린샷 스타일 반영) */}
          <div className="mb-12 border-b border-white/5">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-4 ml-1">
              Timeline
            </p>
            <nav className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {availableMonths.map((month) => (
                <button
                  key={month}
                  onClick={() => setActiveTab(month)}
                  className={`px-6 py-2.5 cursor-pointer rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === month
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {month}
                </button>
              ))}
            </nav>
          </div>

          {/* [하단 영역] 리포트 카드 그리드 (스크롤 가능 공간) */}
          <section className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                {filteredData.map((item) => (
                  <article
                    key={item.id}
                    className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full min-h-[440px] pb-20 shadow-lg"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-full h-44 overflow-hidden bg-[#111] flex items-center justify-center p-10 border-b border-white/5">
                      <img
                        src={item.thumbnail}
                        alt="UIC"
                        className="w-full h-full object-contain opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4 text-[14px] font-medium text-white/30">
                        <span className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{' '}
                          {item.date}
                        </span>
                        <span>{item.author}</span>
                      </div>
                      <h3 className="text-lg font-bold leading-[1.4] text-white/90 group-hover:text-white transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* [요청하신] 다운로드 버튼 (평소 투명 -> 호버시 묵직한 블루 그라데이션) */}
                    <div className="absolute bottom-6 left-6 right-6 h-12">
                      <a
                        href={item.fileUrl}
                        download
                        className="flex items-center justify-center w-full h-full gap-3 text-[13px] font-black tracking-widest uppercase
                                   text-white/40 bg-transparent border border-white/10 rounded-sm
                                   hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] 
                                   hover:border-blue-500/50 hover:text-white
                                   hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(30,58,138,0.4)]
                                   active:scale-[0.97] transition-all duration-500 group/btn"
                      >
                        Download Report
                        <svg
                          className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-white/20 font-medium border border-white/5 dashed">
                해당 월의 리포트가 존재하지 않습니다.
              </div>
            )}
          </section>
        </div>
        <FooterBar />
      </div>
    </main>
  );
};

export default ResearchPage;
