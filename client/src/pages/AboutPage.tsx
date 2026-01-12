import { useState } from 'react';
import { assets } from '../../assets/assets';

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

const AboutPage = () => {
  // 메인 탭 상태: 'greeting' | 'history'
  const [activeTab, setActiveTab] = useState<'greeting' | 'history'>(
    'greeting'
  );

  // [추가] 연혁 필터 상태: 'ALL' | '2020s' | '2010s' | '2000s'
  const [activeDecade, setActiveDecade] = useState('ALL');

  const menuItems = [
    { id: 'greeting', label: 'Greeting' },
    { id: 'history', label: 'History' },
  ];

  const decadeButtons = ['ALL', '2020s', '2010s', '2000s'];

  // 연대별 필터링 로직
  const getFilteredHistory = () => {
    if (activeDecade === 'ALL') return historyData;

    return historyData.filter((item) => {
      const year = parseInt(item.year);
      if (activeDecade === '2020s') return year >= 2020;
      if (activeDecade === '2010s') return year >= 2010 && year < 2020;
      if (activeDecade === '2000s') return year < 2010;
      return true;
    });
  };

  const filteredData = getFilteredHistory();

  return (
    <main className="w-full h-screen overflow-hidden bg-white pt-32 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 h-full">
          {/* [왼쪽] 사이드바 메뉴 */}
          <aside className="lg:w-1/8 shrink-0">
            <nav className="flex flex-row lg:flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-6 py-4 rounded-2xl text-center cursor-pointer font-bold transition-all duration-200 select-none ${
                    activeTab === item.id
                      ? 'text-cyan-600 shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* [오른쪽] 컨텐츠 영역 */}
          <section className="lg:w-7/8 h-full overflow-y-auto pr-4 custom-scrollbar">
            {activeTab === 'greeting' ? (
              // --- 회장 인사말 섹션 (기존 동일) ---
              <div className="pb-20">
                <div className="mb-12">
                  <h1 className="text-3xl text-center font-black md:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-cyan-600 via-blue-800 to-gray-900 p-4">
                    Greeting
                  </h1>
                  <div className="w-12 h-1 bg-uic-teal mt-4 rounded-full" />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                  <div className="xl:col-span-7 text-gray-700 leading-loose text-justify text-lg space-y-6 break-keep lg:pr-8">
                    <p className="font-medium">
                      안녕하십니까,{' '}
                      <strong className="">
                        전국 대학생 투자동아리 연합회(UIC) 제19대 회장 이동원
                      </strong>
                      입니다.
                      <br />
                      <br />
                      1990년 겨울에 싹을 틔운 나무가 어느덧 울창한 숲을 이루듯,
                      우리 UIC 또한 수많은 선배님들의 열정과 헌신 덕분에
                      대한민국 대학생 금융 커뮤니티의 중심으로 우뚝 설 수
                      있었습니다.
                      <br />
                      <br />
                      시장은 끊임없이 변동하고, 불확실성은 언제나 우리 곁에
                      있습니다. 하지만 "지엽에 시선을 빼앗겨 근본을 소홀히
                      해서는 안 된다"는 말처럼, UIC는 투자의 본질을 탐구하고
                      건강한 토론 문화를 정착시키는 데 집중하고자 합니다.
                      <br />
                      <br />
                      수치 너머의 가치를 볼 줄 아는 통찰력, 치열한 분석 끝에
                      얻어지는 확신, 그리고 서로를 통해 배우는 겸손함까지. UIC는
                      단순한 지식의 공유를 넘어, 차세대 금융 리더들이 서로의
                      꿈을 응원하고 함께 성장하는 단단한 뿌리가 되겠습니다.
                      <br />
                      <br />
                      여러분의 뜨거운 열정이 금융의 미래를 밝힐 수 있도록, 저와
                      19대 운영진 모두가 성실하게 소통하고 발로 뛰겠습니다.
                    </p>
                    <p>감사합니다.</p>
                  </div>
                  <div className="xl:col-span-5">
                    <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 shadow-xl border border-gray-100">
                      <img
                        src={assets.logo_uic_color}
                        className="w-full h-full object-contain p-10"
                        alt="회장 프로필"
                      />
                    </div>
                    <div className="pt-10 flex flex-col items-end">
                      <p className="text-xl font-bold">이 동 원</p>
                      <p className="text-sm text-gray-500">19대 UIC 회장</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // --- 연혁 섹션 (필터 버튼 추가됨) ---
              <div className="pb-20">
                <div className="mb-8">
                  <h1 className="text-3xl p-4 md:text-4xl text-center font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-cyan-600 via-blue-800 to-gray-900">
                    UIC History
                  </h1>
                  <div className="w-12 h-1 mt-4 rounded-full" />
                </div>

                {/* [NEW] 연대별 필터 버튼 그룹 */}
                <div className="flex flex-wrap gap-2 mb-12 sticky top-0 bg-white/95 backdrop-blur z-10 py-4 border-b border-gray-100">
                  {decadeButtons.map((decade) => (
                    <button
                      key={decade}
                      onClick={() => setActiveDecade(decade)}
                      className={`px-5 py-2 rounded-full cursor-pointer text-sm font-bold transition-all duration-200 border ${
                        activeDecade === decade
                          ? 'text-cyan-600 border-cyan-600 shadow-md'
                          : 'bg-white text-gray-500 border-gray-500 hover:border-cyan-600 hover:text-cyan-600'
                      }`}
                    >
                      {decade}
                    </button>
                  ))}
                </div>

                <div className="space-y-12 border-l-2 border-gray-100 ml-4 pl-10 relative">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <div
                        key={item.year}
                        className="relative group animate-fadeIn"
                      >
                        {/* 타임라인 점 */}
                        <div className="absolute -left-[51px] top-2 w-5 h-5 border-2 bg-white rounded-full" />
                        <h3 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-600 via-blue-800 to-gray-900 mb-6">
                          {item.year}
                        </h3>
                        <ul className="space-y-5">
                          {item.events.map((event, i) => (
                            <li key={i} className="flex flex-col">
                              <span className="text-uic-teal font-semibold text-xl tracking-tighter">
                                {event.date}
                              </span>
                              <span className="text-gray-800 font-semibold mt-1 break-keep leading-snug whitespace-pre-wrap">
                                {event.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 py-10">
                      해당 기간의 기록이 없습니다.
                    </p>
                  )}
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
