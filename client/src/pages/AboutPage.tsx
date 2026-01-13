// src/pages/AboutPage.tsx
import { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { api } from '../api/api'; // 👈 아까 분리한 api 임포트

// --- 타입 정의 (TypeScript용) ---
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

// 임원진 데이터 (정적 데이터 유지)
const executiveData = [
  {
    role: 'President',
    name: '이동원',
    fullRole: '제19대 전국 대학생 투자동아리 연합(UIC) 회장',
    greeting:
      '안녕하십니까, 전국 대학생 투자동아리 연합(UIC) 제19대 회장 이동원입니다.',
    content:
      '1990년 겨울에 싹을 틔운 나무가 어느덧 울창한 숲을 이루듯, 우리 UIC 또한 수많은 선배님들의 열정과 헌신 덕분에 대한민국 대학생 금융 커뮤니티의 중심으로 우뚝 설 수 있었습니다.',
    quote: '"지엽에 시선을 빼앗겨 근본을 소홀히 해서는 안 된다"',
    image: assets.logo_uic,
  },
  {
    role: 'Vice President',
    name: '황민성',
    fullRole: '제19대 전국 대학생 투자동아리 연합(UIC) 부회장',
    greeting:
      '안녕하십니까, 전국 대학생 투자동아리 연합(UIC) 제19대 부회장 황민성입니다.',
    content:
      '금융의 본질을 이해하고 함께 성장하는 가치를 실현하기 위해 노력하겠습니다. UIC는 여러분의 열정이 실질적인 통찰로 이어지는 최고의 장이 될 것입니다.',
    quote: '"함께할 때 더 멀리 갈 수 있습니다"',
    image: assets.logo_uic,
  },
];

// --- 컴포넌트들 ---
const GreetingSection = ({ data }: { data: (typeof executiveData)[0] }) => (
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
        <p className="opacity-80 font-light">{data.content}</p>
        <p className="opacity-80 font-light italic border-l-2 border-white pl-4">
          {data.quote}
        </p>
      </div>

      <div className="xl:col-span-5 flex flex-col items-end xl:items-end justify-end">
        <div className="relative h-[35vh] xl:h-[45vh] aspect-[3/4] overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl group">
          <img
            src={data.image}
            className="w-full h-full object-contain p-12 opacity-50 transition-transform duration-500 group-hover:scale-105"
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

  // 1️⃣ 데이터를 담을 State 생성 (기존 const historyData 삭제)
  const [historyData, setHistoryData] = useState<GroupedHistory[]>([]);

  const decadeButtons = ['ALL', '2020s', '2010s', '2000s'];

  // 2️⃣ API 호출 및 데이터 가공 (useEffect)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getHistory(); // 백엔드 호출
        const rawData: HistoryItem[] = res.data;

        // [데이터 가공 로직]
        // 백엔드에서 받은 평평한 배열을 -> 연도별로 묶인 형태로 변환
        const groupedMap = rawData.reduce((acc, curr) => {
          const { year, date, title } = curr;
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push({ date, title });
          return acc;
        }, {} as Record<string, { date: string; title: string }[]>);

        // 객체를 배열로 변환하고 연도 내림차순 정렬 (2024 -> 2023)
        const groupedArray: GroupedHistory[] = Object.entries(groupedMap)
          .map(([year, events]) => ({
            year,
            // 같은 연도 내에서는 날짜별 정렬 (선택사항)
            events: events.sort((a, b) => b.date.localeCompare(a.date)),
          }))
          .sort((a, b) => Number(b.year) - Number(a.year));

        setHistoryData(groupedArray); // State 업데이트
      } catch (error) {
        console.error('연혁 불러오기 실패:', error);
      }
    };

    fetchHistory();
  }, []);

  // 3️⃣ 필터링 로직 (State 기반으로 작동)
  const filteredHistory = historyData.filter((item) => {
    if (activeDecade === 'ALL') return true;
    const year = parseInt(item.year);
    if (activeDecade === '2020s') return year >= 2020;
    if (activeDecade === '2010s') return year >= 2010 && year < 2020;
    if (activeDecade === '2000s') return year < 2010;
    return true;
  });

  return (
    <>
      <main className="relative w-full h-screen overflow-hidden text-white pt-32 pb-10">
        <img
          src={assets.bg_about}
          alt="배경"
          className="fixed inset-0 z-0 w-full h-full object-cover opacity-60 pointer-events-none"
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 h-full">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full h-full bg-black/20 backdrop-blur-md p-8 md:p-12 overflow-hidden mt-8 border border-white/5 shadow-2xl">
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
                  {executiveData.map((exec) => (
                    <GreetingSection key={exec.name} data={exec} />
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

                  {/* Decade 버튼 */}
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

                  {/* 연혁 리스트 */}
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
                        등록된 연혁이 없거나 불러오는 중입니다...
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
