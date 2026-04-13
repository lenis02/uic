// src/pages/AboutPage.tsx
import { useState, useEffect, useRef } from 'react';
import { assets } from '../../assets/assets';
import { api } from '../api/api';

// --- 타입 정의 ---
interface HistoryItem {
  year: string;
  date: string;
  title: string;
  id: number;
}

interface GroupedHistory {
  year: string;
  events: { date: string; title: string }[];
}

// [수정] Greeting 데이터 타입 정의
interface Executive {
  role: string;
  name: string;
  fullRole: string;
  greeting: string;
  content: string;
  quote: string;
  image: string;
}

// --- 컴포넌트들 ---
const GreetingSection = ({ data }: { data: Executive }) => (
  // 모바일에서 텍스트와 타이틀이 겹치지 않게 py-12 추가
  <div className="flex flex-col justify-center px-0 relative py-12 lg:py-8">
    {/* 타이틀 영역 */}
    <div className="shrink-0 mb-6 lg:mb-8 w-fit">
      <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-white/80">
        {data.role} 인사말
      </h1>
      <div className="w-full h-1 bg-gradient-to-br from-cyan-700 via-blue-800 to-gray-900 mt-2 md:mt-4 rounded-full" />
    </div>

    {/* [핵심] 모바일: flex-col, PC(lg이상): flex-row */}
    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 w-full xl:gap-20 lg:items-stretch">
      
      {/* 1. 텍스트 영역 (왼쪽/위) */}
      <div className="flex-1 leading-relaxed text-left text-sm md:text-lg space-y-4 md:space-y-6 break-keep w-full">
        <p className="font-semibold text-lg md:text-xl text-white">
          {data.greeting.split(data.name).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="font-bold">{data.name}</span>
              )}
            </span>
          ))}
        </p>
        {/* 모바일 텍스트 폰트 크기 최적화 */}
        <p className="font-light whitespace-pre-line text-xs md:text-base">{data.content}</p>
        {/* <p className="font-light italic border-l-2 border-white pl-4 text-xs md:text-base">
          {data.quote}
        </p> */}
      </div>

      {/* 2. 이미지 및 이름 영역 (오른쪽/아래) */}
      <div className="shrink-0 flex flex-col items-center lg:items-end justify-end w-full lg:w-auto mt-4 lg:mt-0">
        <div className="relative h-[25vh] lg:h-[35vh] aspect-[3/4] overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl group self-center lg:self-auto">
          <img
            src={data.image}
            className="w-full h-full object-cover p-0 opacity-90 transition-transform duration-500 group-hover:scale-105"
            alt={data.name}
          />
        </div>

        {/* 이름 텍스트 */}
        <div className="text-center lg:text-right pt-4 lg:pt-6 w-full lg:max-w-[400px]">
          <span className="text-lg md:text-xl font-semibold tracking-widest text-white">
            {data.name}
          </span>
          <p className="text-gray-500 text-xs md:text-sm">{data.fullRole}</p>
        </div>
      </div>
    </div>
    <div className="mt-10 animate-bounce text-center text-gray-500 text-xs md:text-sm">
                    ↓ scroll
                  </div>
  </div>
  
);

// --- 메인 페이지 컴포넌트 ---
const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<'greeting' | 'history'>(
    'greeting'
  );
  const [activeDecade, setActiveDecade] = useState('ALL');
  const [historyData, setHistoryData] = useState<GroupedHistory[]>([]);

  const scrollRef = useRef<HTMLElement>(null);

  // 1️⃣ [수정] 임원진 데이터 State 추가
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);

  const decadeButtons = ['ALL', '2020s', '2010s', '2000s'];

  useEffect(() => {
    // 2️⃣ API 호출 함수
    const fetchData = async () => {
      try {
        setLoading(true);

        // (1) 연혁 데이터 가져오기
        const historyRes = await api.getHistory();
        const rawHistory: HistoryItem[] = historyRes.data;

        const groupedMap = rawHistory.reduce((acc, curr) => {
          const { year, date, title } = curr;
          if (!acc[year]) acc[year] = [];
          acc[year].push({ date, title });
          return acc;
        }, {} as Record<string, { date: string; title: string }[]>);

        const groupedArray = Object.entries(groupedMap)
          .map(([year, events]) => ({
            year,
            events: events.sort((a, b) => b.date.localeCompare(a.date)),
          }))
          .sort((a, b) => Number(b.year) - Number(a.year));

        setHistoryData(groupedArray);

        // (2) 인사말 데이터 가져오기 (Promise.all로 병렬 처리)
        const [presRes, viceRes] = await Promise.all([
          api.getGreetingByRole('회장'),
          api.getGreetingByRole('부회장'),
        ]);

        const formatExecutive = (res: any, role: string): Executive => ({
          role,
          name: res.data.name || '',
          fullRole: res.data.fullRole || '',
          greeting: res.data.greeting || '',
          content: res.data.content || '',
          quote: res.data.quote || '',
          // 이미지가 없으면 기본 로고 사용
          image: res.data.imageUrl ? res.data.imageUrl : assets.logo_uic,
        });

        setExecutives([
          formatExecutive(presRes, '회장'),
          formatExecutive(viceRes, '부회장'),
        ]);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeTab, activeDecade]);

  const filteredHistory = historyData.filter((item) => {
    if (activeDecade === 'ALL') return true;
    const year = parseInt(item.year);
    if (activeDecade === '2020s') return year >= 2020;
    if (activeDecade === '2010s') return year >= 2010 && year < 2020;
    if (activeDecade === '2000s') return year < 2010;
    return true;
  });

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* 모바일에서 상하단 패딩 축소 */}
      <main className="relative w-full h-screen overflow-hidden text-white pt-20 md:pt-32 pb-6 md:pb-10">
        <img
          src={assets.bg_about}
          alt="배경"
          className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />

        {/* 모바일 좌우 패딩 축소 px-4 */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-12 h-full">
          {/* 모바일 패딩 축소(p-4), 모서리 둥글게(rounded-2xl) 적용 */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20 w-full h-full bg-black/20 backdrop-blur-2xl p-4 md:p-8 lg:p-12 overflow-hidden mt-12 border border-white/5 shadow-2xl md:rounded-none">
            
            {/* 좌측 탭 네비게이션 (모바일에서 가로 스크롤 허용) */}
            <aside className="lg:w-32 shrink-0 z-20">
              <nav className="flex flex-row lg:flex-col gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                {(['greeting', 'history'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-6 py-2 md:py-2.5 cursor-pointer text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </aside>

            {/* 본문 섹션 */}
            <section
              ref={scrollRef}
              className={`flex-1 h-full overflow-y-auto pr-2 md:pr-4 custom-scrollbar z-20 scroll-smooth scrollbar-hide`}
            >
              {activeTab === 'greeting' ? (
                <div className="h-full">
                  {executives.map((exec) => (
                    <GreetingSection key={exec.role} data={exec} />
                  ))}
                  
                </div>
              ) : (
                <div className="pb-20 md:pb-32">
                  <header className="">
                    <div className="mb-4 w-fit">
                      <h1 className="text-2xl md:text-4xl pt-2 font-semibold tracking-tight text-white/80">
                        연혁
                      </h1>
                      <div className="w-full h-1 bg-gradient-to-br from-cyan-700 via-blue-800 to-gray-900 mt-2 md:mt-4 rounded-full" />
                    </div>
                  </header>

                  {/* 연대별 필터 버튼 (모바일 가로 스크롤 추가) */}
                  <div className="flex px-2 md:px-6 flex-row overflow-x-auto lg:flex-wrap gap-2 md:gap-4 mb-8 md:mb-12 sticky top-0 z-30 py-3 md:py-6 border-b border-white/10 rounded-xl bg-black/40 backdrop-blur-xl scrollbar-hide">
                    {decadeButtons.map((decade) => (
                      <button
                        key={decade}
                        onClick={() => setActiveDecade(decade)}
                        className={`px-4 md:px-6 py-1.5 md:py-2.5 cursor-pointer rounded-lg text-xs md:text-sm font-bold whitespace-nowrap ${
                          activeDecade === decade
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {decade}
                      </button>
                    ))}
                  </div>

                  {/* 타임라인 영역 (모바일에서 여백 축소 및 도트 위치 재계산) */}
                  {/* 데스크탑: ml-4 pl-10 (도트 -45.5px) / 모바일: ml-2 pl-6 (도트 -29px) */}
                  <div className="space-y-10 md:space-y-16 border-l border-white/10 ml-2 md:ml-4 pl-6 md:pl-10 relative">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <div
                          key={item.year}
                          className="relative group animate-fadeIn"
                        >
                          <div className="absolute -left-[29px] md:-left-[45.5px] top-1.5 md:top-2 w-2 md:w-2.5 h-2 md:h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 tracking-tight">
                            {item.year}
                          </h3>
                          <ul className="space-y-4 md:space-y-6">
                            {item.events.map((event, i) => (
                              <li key={i} className="flex flex-col group/item">
                                <span className="font-bold text-base md:text-lg">
                                  {event.date}
                                </span>
                                <span className="text-sm md:text-base text-gray-300 font-medium mt-1 break-keep leading-relaxed whitespace-pre-wrap group-hover/item:text-white transition-colors italic">
                                  {event.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="text-white/50 text-base md:text-lg">
                        등록된 연혁이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
