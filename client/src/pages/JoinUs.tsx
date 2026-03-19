import FooterBar from '../components/FooterBar';

// 파일 경로 설정 (public 폴더 기준)
const CLUB_FILE_URL = '/files/UIC 동아리 및 학회 가입 등록원 (2026).pptx';
const INDIVIDUAL_FILE_URL = '/files/UIC 개인회원 가입 등록원 (2026).pptx';

const JoinUs = () => {
  return (
    <section
      id="join"
      // 모바일에서는 스크롤을 허용하고, 데스크탑은 기존처럼 overflow-hidden 유지. pt-32 -> pt-24로 모바일 상단 여백 축소.
      className="relative h-[100dvh] w-full snap-start flex flex-col items-center justify-between bg-[#050505] text-white overflow-y-auto md:overflow-hidden pt-32 scrollbar-hide"
    >
      {/* 배경 장식 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* 상단 타이틀 영역 */}
      {/* mt-8 -> mt-2 md:mt-8로 모바일 여백 축소 */}
      <div className="relative mt-2 md:mt-8 z-10 text-center mb-6 md:mb-8 select-none shrink-0">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white/80">
          JOIN US
        </h1>
        <div className="h-[2px] w-24 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mx-auto mt-3 md:mt-4 mb-3 md:mb-4" />
        <p className="text-xs md:text-lg text-gray-400 font-medium tracking-widest uppercase break-keep px-4">
          UIC와 함께 성장을 도모할 열정적인 분을 기다립니다.
          <br />
          {/* 모바일 폰트 크기 축소 text-base md:text-2xl */}
          <span className="lowercase text-base md:text-2xl mt-1 inline-block">&lt;koreauic@gmail.com&gt;</span>
        </p>
      </div>

      {/* 메인 카드 컨테이너 */}
      {/* 모바일에서 카드 폭을 w-[92%]로 넓히고 모서리 둥글게(rounded-2xl) 처리. 하단 여백(mb-8) 추가 */}
      <div className="relative z-10 w-[92%] md:w-[90%] max-w-[1100px] h-auto h-[40%] md:h-[60%] min-h-[500px] mb-8 md:mb-0 overflow-hidden shadow-2xl border border-white/5 rounded-2xl md:rounded-none shrink-0">
        <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-md" />

        {/* p-10 -> p-4 md:p-10 모바일 패딩 축소 */}
        <div className="relative h-full w-full flex flex-col md:flex-row p-4 md:p-10 gap-4 md:gap-6">
          
          {/* [왼쪽] Club Membership */}
          <div className="group relative flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden flex flex-col rounded-xl md:rounded-none min-h-[240px] md:min-h-0">
            {/* p-8 -> p-6 md:p-8 모바일 패딩 축소 */}
            <div className="h-full overflow-y-auto p-6 md:p-8 pb-20 md:pb-32 scrollbar-hide">
              <h2 className="text-xl text-center md:text-3xl font-bold mb-2 md:mb-4 tracking-tight leading-tight">
                Club <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 font-black">
                  Membership
                </span>
              </h2>
              <p className="text-gray-400 text-center text-xs md:text-sm leading-relaxed mb-6 md:mb-8 break-keep">
                동아리 가입을 위한 단체 지원 프로세스입니다.
              </p>
              
              <div className="space-y-3 md:space-y-4">
                {/* 모바일은 정중앙 정렬되도록 -ml-4를 md:-ml-4로 변경 */}
                <div className="flex items-center justify-center md:-ml-4 gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <p className="text-xs md:text-sm text-gray-400 font-medium">
                    PDF 형식 변환 제출 준수
                  </p>
                </div>
                <div className="flex items-center justify-center md:-ml-4 gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <p className="text-xs md:text-sm text-gray-400 font-medium">
                    활동 계획서 및 동아리 소개서 필수
                  </p>
                </div>
              </div>
            </div>

            {/* Club 다운로드 버튼: 여백 및 높이 축소 */}
            <a
              href={CLUB_FILE_URL}
              download="UIC_Club_Application.pptx"
              className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 h-[44px] md:h-[56px] text-sm md:text-base bg-white text-black font-bold rounded-xl md:rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden group/btn cursor-pointer flex items-center justify-center z-10"
            >
              <span className="relative z-10">지원서 양식 다운로드 (.pptx)</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </a>

            <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* [오른쪽] Individual Membership */}
          <div className="group relative flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden flex flex-col rounded-xl md:rounded-none min-h-[240px] md:min-h-0">
            <div className="h-full overflow-y-auto p-6 md:p-8 pb-20 md:pb-32 scrollbar-hide">
              <h2 className="text-center text-xl md:text-3xl font-bold mb-2 md:mb-4 tracking-tight leading-tight">
                Individual <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-gray-400 font-black">
                  Membership
                </span>
              </h2>
              <p className="text-gray-400 text-center text-xs md:text-sm leading-relaxed mb-6 md:mb-8 break-keep">
                신규 회원을 위한 개인 지원 프로세스입니다.
              </p>
              
              <div className="space-y-3 md:space-y-4 md:-ml-4">
                <div className="flex w-full justify-center items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full md:mt-2 bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                  <p className="text-xs md:text-sm text-gray-400 font-medium">
                    PDF 형식 변환 제출 준수
                  </p>
                </div>
                <div className="flex w-full justify-center items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 rounded-full md:mt-2 bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                  <p className="text-xs md:text-sm text-gray-400 font-medium">
                    주 단위로 합격 여부 발표
                  </p>
                </div>
              </div>
            </div>

            {/* Individual 다운로드 버튼 */}
            <a
              href={INDIVIDUAL_FILE_URL}
              download="UIC_Individual_Application.pptx"
              className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 h-[44px] md:h-[56px] text-sm md:text-base bg-white text-black font-bold rounded-xl md:rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden group/btn cursor-pointer flex items-center justify-center z-10"
            >
              <span className="relative z-10">
                지원서 양식 다운로드 (.pptx)
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </a>

            <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <FooterBar />
    </section>
  );
};

export default JoinUs;