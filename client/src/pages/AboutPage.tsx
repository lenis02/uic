// src/pages/AboutPage.tsx
import { useState, useEffect } from 'react';
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
  <div className="snap-start min-h-full flex flex-col justify-center pb-20">
    <div className="mb-12 w-fit">
      <h1 className="text-4xl font-semibold tracking-tight text-white/80">
        {data.role} Greeting
      </h1>
      <div className="w-full h-1 bg-gradient-to-br from-cyan-700 via-blue-800 to-gray-900 mt-4 rounded-full" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">
      <div className="xl:col-span-7 leading-relaxed text-justify text-lg space-y-6 break-keep lg:pr-8">
        <p className="font-semibold text-xl text-white">
          {data.greeting.split(data.name).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="font-bold">{data.name}</span>
              )}
            </span>
          ))}
        </p>
        <p className="font-light whitespace-pre-line">{data.content}</p>
        <p className="font-light italic border-l-2 border-white pl-4">
          {data.quote}
        </p>
      </div>

      <div className="xl:col-span-5 flex flex-col items-end xl:items-end justify-end">
        <div className="relative h-[35vh] xl:h-[45vh] aspect-[3/4] overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl group">
          <img
            src={data.image}
            className="w-full h-full object-cover p-0 opacity-90 transition-transform duration-500 group-hover:scale-105" // object-contain -> cover로 변경, opacity 조정
            alt={data.name}
          />
        </div>
        <div className="text-right pt-6 w-full xl:max-w-[400px]">
          <span className="text-xl font-semibold tracking-widest text-white">
            {data.name}
          </span>
          <p className="text-gray-500 text-sm">{data.fullRole}</p>
        </div>
      </div>
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
        // 백엔드에서 역할 이름이 'President', 'Researcher'(부회장용) 라고 가정
        const [presRes, viceRes] = await Promise.all([
          api.getGreetingByRole('President'),
          api.getGreetingByRole('Vice President'),
        ]);

        const formatExecutive = (res: any, role: string): Executive => ({
          role,
          name: res.data.name || '',
          fullRole: res.data.fullRole || '',
          greeting: res.data.greeting || '',
          content: res.data.content || '',
          quote: res.data.quote || '',
          // 이미지가 없으면 기본 로고 사용
          image: res.data.imageUrl
            ? `${import.meta.env.VITE_API_URL}${res.data.imageUrl}`
            : assets.logo_uic,
        });

        setExecutives([
          formatExecutive(presRes, 'President'),
          formatExecutive(viceRes, 'Vice President'),
        ]);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <main className="relative w-full h-screen overflow-hidden text-white pt-32 pb-10">
        <img
          src={assets.bg_about}
          alt="배경"
          className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 h-full">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full h-full bg-black/20 backdrop-blur-2xl p-8 md:p-12 overflow-hidden mt-8 border border-white/5 shadow-2xl">
            <aside className="lg:w-40 shrink-0 z-20">
              <nav className="flex flex-row lg:flex-col gap-3">
                {(['greeting', 'history'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 cursor-pointer rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
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

            <section
              className={`flex-1 h-full overflow-y-auto pr-4 custom-scrollbar z-20 scroll-smooth scrollbar-hide ${
                activeTab === 'greeting' ? 'snap-y snap-mandatory' : ''
              }`}
            >
              {activeTab === 'greeting' ? (
                <div className="h-full">
                  {/* [수정] 백엔드에서 받아온 executives 배열 매핑 */}
                  {executives.map((exec) => (
                    <GreetingSection key={exec.role} data={exec} />
                  ))}
                  <div className="mt-10 animate-bounce text-center text-gray-500 text-sm">
                    ↓ scroll
                  </div>
                </div>
              ) : (
                <div className="pb-32">
                  <header className="">
                    <div className="mb-4 w-fit">
                      <h1 className="text-4xl font-semibold tracking-tight text-white/80">
                        History of UIC
                      </h1>
                      <div className="w-full h-1 bg-gradient-to-br from-cyan-700 via-blue-800 to-gray-900 mt-4 rounded-full" />
                    </div>
                  </header>

                  <div className="flex px-6 flex-wrap gap-4 mb-12 sticky top-0 z-30 py-6 border-b border-white/10 rounded-xl bg-black/40 backdrop-blur-xl">
                    {decadeButtons.map((decade) => (
                      <button
                        key={decade}
                        onClick={() => setActiveDecade(decade)}
                        className={`px-6 py-2.5 cursor-pointer rounded-lg text-sm font-bold whitespace-nowrap ${
                          activeDecade === decade
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {decade}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-16 border-l border-white/10 ml-4 pl-10 relative">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <div
                          key={item.year}
                          className="relative group animate-fadeIn"
                        >
                          <div className="absolute -left-[45.5px] top-2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                          <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">
                            {item.year}
                          </h3>
                          <ul className="space-y-6">
                            {item.events.map((event, i) => (
                              <li key={i} className="flex flex-col group/item">
                                <span className="font-bold text-lg">
                                  {event.date}
                                </span>
                                <span className="text-gray-300 font-medium mt-1 break-keep leading-relaxed whitespace-pre-wrap group-hover/item:text-white transition-colors italic">
                                  {event.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="text-white/50 text-lg">
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
