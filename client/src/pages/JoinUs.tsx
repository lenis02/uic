import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import { api } from '../api/api';

type JoinFormType = 'club' | 'individual' | 'joint';

interface JoinForm {
  type: JoinFormType;
  description: string;
  bullets: string;
  fileUrl: string | null;
  fileName: string | null;
}

// 카드 3종의 고정 요소(제목/테마 색). 문구와 파일은 관리자 화면에서 관리한다.
const CARDS: {
  type: JoinFormType;
  heading: string;
  accent: string;
  accentGradient: string;
  dot: string;
  buttonGlow: string;
  downloadName: string;
  fallbackDescription: string;
  fallbackBullets: string[];
  fallbackFileUrl: string;
}[] = [
  {
    type: 'club',
    heading: 'Club',
    accent: 'Membership',
    accentGradient: 'from-purple-400 via-purple-500 to-indigo-600',
    dot: 'shrink-0 w-1.5 h-1.5 bg-purple-500 shadow-[0_0_8px_#a855f7]',
    buttonGlow: 'from-purple-100 to-white',
    downloadName: 'UIC_Club_Application.pptx',
    fallbackDescription: '동아리 가입을 위한 단체 지원 프로세스입니다.',
    fallbackBullets: ['PDF 형식 변환 제출 준수', '활동 계획서 및 동아리 소개서 필수'],
    fallbackFileUrl: '/files/UIC 동아리 및 학회 가입 등록원 (2026).pptx',
  },
  {
    type: 'individual',
    heading: 'Individual',
    accent: 'Membership',
    accentGradient: 'from-cyan-500 via-blue-600 to-gray-400',
    dot: 'shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]',
    buttonGlow: 'from-cyan-100 to-white',
    downloadName: 'UIC_Individual_Application.pptx',
    fallbackDescription: '신규 회원을 위한 개인 지원 프로세스입니다.',
    fallbackBullets: ['PDF 형식 변환 제출 준수', '주 단위로 합격 여부 발표'],
    fallbackFileUrl: '/files/UIC 개인회원 가입 등록원 (2026).pptx',
  },
  {
    type: 'joint',
    heading: 'Joint',
    accent: 'Session',
    accentGradient: 'from-teal-300 via-emerald-400 to-teal-600',
    dot: 'shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]',
    buttonGlow: 'from-emerald-100 to-white',
    downloadName: 'UIC_Joint_Session_Application.pptx',
    fallbackDescription:
      'UIC 소속 동아리·학회 간 교류를 위한 연합세션 참가 프로세스입니다.',
    fallbackBullets: [
      'PDF 형식 변환 제출 준수',
      '리서치·운용보고서 등 활동 자료 첨부 필수',
    ],
    fallbackFileUrl: '/files/UIC 연합세션 참가 신청서 (2026).pptx',
  },
];

const splitBullets = (bullets: string) =>
  bullets
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const JoinUs = () => {
  const [forms, setForms] = useState<Partial<Record<JoinFormType, JoinForm>>>({});

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.getJoinForms();
        const next: Partial<Record<JoinFormType, JoinForm>> = {};
        (res.data as JoinForm[]).forEach((form) => {
          next[form.type] = form;
        });
        setForms(next);
      } catch (err) {
        // 실패해도 아래 fallback 문구로 그대로 렌더된다.
        console.error('지원 안내 로딩 실패:', err);
      }
    };

    fetchForms();
  }, []);

  return (
    <section
      id="join"
      // 모바일에서는 스크롤을 허용하고, 데스크탑은 기존처럼 overflow-hidden 유지. pt-32 -> pt-24로 모바일 상단 여백 축소.
      className="relative h-[100dvh] w-full snap-start flex flex-col items-center justify-between bg-[#050505] text-white overflow-y-auto lg:overflow-hidden pt-24 scrollbar-hide"
    >
      {/* 배경 장식 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* 상단 타이틀 영역 */}
      {/* mt-8 -> mt-2 md:mt-8로 모바일 여백 축소 */}
      <div className="relative mt-2 md:mt-4 z-10 text-center mb-4 md:mb-4 select-none shrink-0">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white/80">
          JOIN US
        </h1>
        <div className="h-[2px] w-24 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mx-auto mt-3 md:mt-4 mb-3 md:mb-4" />
        <p className="text-xs md:text-lg text-gray-400 font-medium tracking-widest uppercase break-keep px-4">
          UIC와 함께 성장을 도모할 열정적인 분을 기다립니다.
          <br />
          {/* 모바일 폰트 크기 축소 text-base md:text-2xl */}
          <span className="lowercase text-base md:text-2xl mt-1 inline-block">
            &lt;koreauic@gmail.com&gt;
          </span>
        </p>
      </div>

      {/* 메인 카드 컨테이너 */}
      {/* 모바일에서 카드 폭을 w-[92%]로 넓히고 모서리 둥글게(rounded-2xl) 처리. 하단 여백(mb-8) 추가 */}
      {/* 카드가 3개라 lg 미만에서는 h-auto로 세로 스택 후 섹션 스크롤, lg 이상에서만 3열 고정 높이 */}
      <div className="relative z-10 w-[92%] md:w-[90%] max-w-[1100px] h-auto lg:h-[60%] lg:min-h-[500px] mb-8 lg:mb-0 overflow-hidden shadow-2xl border border-white/5 rounded-2xl lg:rounded-none shrink-0">
        <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-md" />

        {/* p-10 -> p-4 lg:p-10 모바일/태블릿 패딩 축소, 3열은 lg부터 */}
        <div className="relative h-full w-full flex flex-col lg:flex-row p-4 lg:p-10 gap-4 lg:gap-6">
          {CARDS.map((card) => {
            const saved = forms[card.type];
            const description = saved?.description || card.fallbackDescription;
            const bullets = saved
              ? splitBullets(saved.bullets)
              : card.fallbackBullets;
            const fileUrl = saved?.fileUrl || card.fallbackFileUrl;
            // 양식 파일은 pptx/docx/hwp 중 무엇이든 될 수 있어 확장자를 실제 파일에서 읽는다.
            const extension = (saved?.fileName || fileUrl)
              .split('.')
              .pop()
              ?.toLowerCase();

            return (
              // flex-1은 lg(가로 배치)에서만 적용. 세로 스택에서 flex-1은 높이를 균등 분배해 내용이 잘림
              <div
                key={card.type}
                className="group relative lg:flex-1 min-w-0 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden flex flex-col rounded-xl lg:rounded-none min-h-[240px] lg:min-h-0"
              >
                {/* p-8 -> p-6 lg:p-8 모바일 패딩 축소. 불릿이 2줄로 늘어나도 버튼과 붙지 않게 pb-28 */}
                <div className="h-full overflow-y-auto p-6 lg:p-8 pb-28 lg:pb-32 scrollbar-hide">
                  <h2 className="text-center text-xl md:text-2xl xl:text-3xl font-bold mb-2 md:mb-4 tracking-tight leading-tight">
                    {card.heading} <br className="hidden lg:block" />
                    <span
                      className={`bg-clip-text text-transparent bg-gradient-to-r ${card.accentGradient} font-black`}
                    >
                      {card.accent}
                    </span>
                  </h2>
                  <p className="text-gray-400 text-center text-xs md:text-sm leading-relaxed mb-6 md:mb-8 break-keep">
                    {description}
                  </p>

                  <div className="space-y-3 md:space-y-4">
                    {bullets.map((bullet, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center gap-2 md:gap-3"
                      >
                        <div className={card.dot} />
                        <p className="text-xs md:text-sm text-gray-400 font-medium break-keep">
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 다운로드 버튼: 여백 및 높이 축소 */}
                <a
                  href={fileUrl}
                  download={saved?.fileName || card.downloadName}
                  className="absolute bottom-4 lg:bottom-8 left-4 xl:left-8 right-4 xl:right-8 h-[44px] lg:h-[56px] text-sm xl:text-base bg-white text-black font-bold rounded-xl lg:rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden group/btn cursor-pointer flex items-center justify-center z-10"
                >
                  <span className="relative z-10 whitespace-nowrap">
                    지원서 양식 다운로드{extension ? ` (.${extension})` : ''}
                  </span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${card.buttonGlow} opacity-0 group-hover/btn:opacity-100 transition-opacity`}
                  />
                </a>

                <div className="absolute bottom-0 left-0 w-full h-24 lg:h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 지원 카드 아래에 ContactUs로 넘어가는 보조 CTA 배치 */}
      <Link
        to="/contact"
        className="relative z-10 shrink-0 mb-3 md:mb-4 whitespace-nowrap px-6 py-2 md:px-8 md:py-2.5 rounded-xl md:rounded-2xl border border-white/60 text-white text-sm md:text-base font-bold tracking-tight transition-all duration-300 hover:bg-white/10 hover:border-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        문의하러 가기
      </Link>

      <FooterBar />
    </section>
  );
};

export default JoinUs;
