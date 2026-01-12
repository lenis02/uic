import { useState } from 'react';
import { assets } from '../../assets/assets';

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

const historyData = [
  {
    year: '2020',
    events: [
      {
        date: '06.01',
        title:
          'UIC X 유안타증권 실전투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      { date: '08.13', title: '한국증권인재개발원 상호지원을 위한 MOU 체결' },
      { date: '08.22', title: '제9회 투자콘서트 개최' },
      {
        date: '12.14',
        title:
          'UIC X 유안타증권 모의투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      {
        date: '12.19',
        title: '금융권 직무 토크쇼 (주관 - UIC X CFA Society Korea)',
      },
    ],
  },
  {
    year: '2019',
    events: [
      {
        date: '05.18',
        title: '금융권 직무 토크쇼 (주관 - UIC X CFA Society Korea)',
      },
      {
        date: '05.09',
        title:
          'UIC X 유안타증권 실전투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
      { date: '08.13', title: '한국증권인재개발원 상호지원을 위한 MOU 체결' },
      { date: '08.24', title: '제8회 투자콘서트 개최' },
      { date: '11.24', title: '헤지펀드 콘서트 (주관 - 금융투자협회)' },
    ],
  },
  {
    year: '2018',
    events: [
      {
        date: '05.26',
        title: '금융권 직무 토크쇼 (주관 - UIC X CFA Society Korea)',
      },
      { date: '06.25', title: '핀업스탁 상호지원을 위한 MOU 체결' },
      { date: '08.25', title: '제7회 투자콘서트 개최' },
      { date: '11.25', title: '헤지펀드 콘서트 (주관 - 금융투자협회)' },
    ],
  },
  {
    year: '2017',
    events: [
      {
        date: '03.15',
        title: '이리온 공개방송 강연 참가제휴 (주관 - 이베스트투자증권)',
      },
      {
        date: '07.29',
        title: 'UIC 워크샵 진행 (공동주관 - UIC X 전국투자자교육협의회)',
      },
      { date: '08.31', title: '한국투자증권 상호지원을 위한 MOU 체결' },
      { date: '09.09', title: '제6회 투자콘서트 개최' },
      {
        date: '10.14',
        title: '헤지펀드 콘서트 참가제휴 (주관 - 금융투자협회)',
      },
    ],
  },
  {
    year: '2016',
    events: [
      {
        date: '03.30',
        title: '2016 메트로 100세플러스 포럼 참가제휴 (주관 - 메트로신문)',
      },
      { date: '08.20', title: '제5회 투자콘서트 개최' },
      {
        date: '10.04',
        title:
          'UIC X 유안타증권 모의투자대회 (주최-전국 대학생 투자동아리 연합회/주관-유안타증권)',
      },
    ],
  },
  {
    year: '2015',
    events: [
      {
        date: '04.27',
        title: '증권플러스 인사이트 필진 연계 (주관-두나무_증권플러스)',
      },
      {
        date: '05.01',
        title:
          '금융 교육 장학생 ‘이패스 프렌즈’ (주최-전국 대학생 투자동아리 연합회/주관-이패스코리아)',
      },
      { date: '08.22', title: '제4회 투자콘서트 개최' },
      {
        date: '12.04',
        title: '2016 대한민국 재테크 박람회 서포터즈 (주최-조선일보 외)',
      },
    ],
  },
  {
    year: '2014',
    events: [
      { date: '06.10', title: '글로벌 자산배분 포럼 참가제휴' },
      { date: '07.01', title: '펀드온라인코리아(주) 업무협약 체결' },
      { date: '08.30', title: '제3회 투자콘서트 개최' },
    ],
  },
  {
    year: '2013',
    events: [
      {
        date: '03.25~06.07',
        title: 'UIC&키움증권 차세대 HTS 모니터링 보고서 공모전',
      },
      { date: '06.11~06.12', title: '세계전략포럼2013 참가 제휴' },
      { date: '06.22', title: 'CFA Career Development and Networking Seminar' },
      { date: '08.31', title: '제2회 투자콘서트 개최' },
    ],
  },
  {
    year: '2012',
    events: [
      {
        date: '03.17',
        title: '전국 대학생 투자동아리 연합회 Research Book 발간',
      },
      { date: '03.29', title: '2012 국제금융컨퍼런스 참석 제휴' },
      {
        date: '03.26~04.27',
        title:
          '삼성증권배 UIC 모의투자대 (주최-삼성증권/주관-전국 대학생 투자동아리 연합회)',
      },
      {
        date: '07.29~09.08',
        title:
          '제1회 ALL바른 투자콘서트 개최 (주최-전국 대학생 투자동아리 연합회/주관-삼성증권/후원-크레듀, Bloomberg)',
      },
    ],
  },
  {
    year: '2011',
    events: [
      {
        date: '01.21',
        title:
          '제1회 전국 투자 동아리 리서치 대회 (주최-전국 대학생 투자동아리 연합회/주관-KTB증권)',
      },
      {
        date: '02.26',
        title:
          '키움증권 Valuation 강의 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        date: '04.04~08.05',
        title:
          '제2회 이데일리 챔피언스리그 실전투자대회 (주최-전국 대학생 투자동아리 연합회/주관-이데일리)',
      },
      {
        date: '07.19',
        title:
          '동부증권 투자설명회 (주최-전국 대학생 투자동아리 연합회/주관-동부증권)',
      },
      {
        date: '09~11.30',
        title:
          '대학생 주식아카데미 ‘Stock Master’ (주최-전국 대학생 투자동아리 연합회/주관-한국주식가치평가원)',
      },
    ],
  },
  {
    year: '2010',
    events: [
      {
        date: '05.08~06.30',
        title:
          '제1차 키움증권 Valuation 강의 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        date: '07.06~07.07',
        title:
          '제5회 대학생 금융투자캠프 참가 (주관-전국 대학생 투자동아리 연합회)',
      },
    ],
  },
  {
    year: '2009',
    events: [
      {
        date: '05.01~06',
        title:
          '키움증권 UCC 애널리스트 선발대회 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
      {
        date: '05.16',
        title:
          '키움증권 대학생 심포지엄 (주최-전국 대학생 투자동아리 연합회/주관-키움증권)',
      },
    ],
  },
  {
    year: '2008',
    events: [
      {
        date: '02.25~12.19',
        title:
          '도전 캠퍼스 주식왕-실전투자대회 - 25개 대학 참가 (주최-전국 대학생 투자동아리 연합회/주관-한국경제TV/후원-CJ증권)',
      },
      {
        date: '08.23',
        title:
          '제2회 전국 대학생 투자동아리 연합회 연합포럼 (주최-전국 대학생 투자동아리 연합회/후원-굿모닝 신한증권)',
      },
      {
        date: '12.22~01.23',
        title:
          '제1회 현대증권 여대생 모의투자대회 (주최-전국 대학생 투자동아리 연합회/주관-현대증권)',
      },
    ],
  },
  {
    year: '2007',
    events: [
      {
        date: '05.24',
        title:
          '제1회 한경 대학생 증권동아리 포럼 (주최-전국 대학생 투자동아리 연합회)',
      },
      {
        date: '10.01~03.28',
        title:
          '한경 대학생 동아리 모의투자대회 - 30개 대학 참가 (주최-전국 대학생 투자동아리 연합회/주관-한국경제)',
      },
    ],
  },
  {
    year: '2006',
    events: [
      {
        date: '08.18',
        title: '대학생 투자동아리 연합발족, 연합세션 (12개 학교 참가)',
      },
    ],
  },
];

const GreetingSection = ({ data }: { data: (typeof executiveData)[0] }) => (
  <div className="snap-start min-h-full flex flex-col justify-center pb-20">
    <div className="mb-12 w-fit">
      <h1 className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        {data.role} Greeting
      </h1>
      <div className="w-full h-1 bg-purple-400 mt-4 rounded-full" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">
      <div className="xl:col-span-7 text-gray-200 leading-relaxed text-justify text-lg space-y-6 break-keep lg:pr-8">
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
        <p className="opacity-80 font-light italic border-l-2 border-purple-400/50 pl-4">
          {data.quote}
        </p>
      </div>

      <div className="xl:col-span-5">
        <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl group">
          <img
            src={data.image}
            className="w-full h-full object-contain p-12 opacity-50 transition-transform duration-500 group-hover:scale-105"
            alt={data.name}
          />
        </div>
        <div className="text-right pt-6">
          <span className="text-xl font-semibold tracking-widest text-white">
            {data.name}
          </span>
          <p className="text-gray-500 text-sm">{data.fullRole}</p>
        </div>
      </div>
    </div>
  </div>
);

// --- 메인 컴포넌트 ---
const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<'greeting' | 'history'>(
    'greeting'
  );
  const [activeDecade, setActiveDecade] = useState('ALL');

  const decadeButtons = ['ALL', '2020s', '2010s', '2000s'];

  const filteredHistory = historyData.filter((item) => {
    if (activeDecade === 'ALL') return true;
    const year = parseInt(item.year);
    if (activeDecade === '2020s') return year >= 2020;
    if (activeDecade === '2010s') return year >= 2010 && year < 2020;
    if (activeDecade === '2000s') return year < 2010;
    return true;
  });

  return (
    <main className="relative w-full h-screen overflow-hidden text-white pt-32 pb-10">
      <img
        src={assets.bg_about}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-40 pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 w-full h-full bg-black/20 backdrop-blur-md p-8 md:p-12 overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl">
          <aside className="lg:w-40 shrink-0 z-20">
            <nav className="flex flex-row lg:flex-col gap-3">
              {(['greeting', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 cursor-pointer rounded-2xl font-bold transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-purple-400 bg-purple-400/10 border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
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
              /* History 섹션 실질 로직 복구 */
              <div className="pb-32">
                <header className="mb-12">
                  <h1 className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                    History of UIC
                  </h1>
                  <div className="w-40 h-1 bg-purple-400 mt-4 rounded-full" />
                </header>

                <div className="flex px-4 flex-wrap gap-2 mb-12 sticky top-0 z-30 py-4 bg-black/40 backdrop-blur-md border-b border-white/5">
                  {decadeButtons.map((decade) => (
                    <button
                      key={decade}
                      onClick={() => setActiveDecade(decade)}
                      className={`px-5 py-2 cursor-pointer rounded-full text-sm font-bold transition-all border ${
                        activeDecade === decade
                          ? 'text-purple-400 border-purple-400 bg-purple-400/10'
                          : 'text-gray-500 border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {decade}
                    </button>
                  ))}
                </div>

                <div className="space-y-16 border-l border-white/10 ml-4 pl-10 relative">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.year}
                      className="relative group animate-fadeIn"
                    >
                      <div className="absolute -left-[45.5px] top-2 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" />
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
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
