import FooterBar from '../components/FooterBar';

const JoinUs = () => {
  return (
    <section
      id="join"
      className="relative h-screen w-full snap-start flex flex-col items-center bg-[#050505] text-white overflow-hidden pt-32"
    >
      {/* 배경 장식 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* 상단 타이틀 영역 */}
      <div className="relative mt-8 z-10 text-center mb-8 select-none">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white/80">
          JOIN US
        </h1>
        <div className="h-[2px] w-24 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mx-auto mt-4 mb-4" />
        <p className="text-sm md:text-lg text-gray-400 font-medium tracking-widest uppercase break-keep px-4">
          UIC와 함께 성장을 도모할 열정적인 분을 기다립니다.
        </p>
      </div>

      {/* 메인 카드 컨테이너 */}
      {/* 수정 1: min-h-[500px] 추가 (화면이 작아져도 카드가 너무 납작해지지 않도록 최소 높이 보장) */}
      <div className="relative z-10 w-[90%] max-w-[1100px] h-auto md:h-[60%] min-h-[500px]  overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-md" />

        <div className="relative h-full w-full flex flex-col md:flex-row p-6 md:p-10 gap-6">
          {/* [왼쪽] Club Membership */}
          {/* 수정 2: overflow-hidden 추가 (내부 스크롤이 둥근 모서리를 넘지 않게) */}
          <div className="group relative flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden flex flex-col">
            {/* 수정 3: 텍스트 영역을 감싸는 div에 스크롤 기능 부여 */}
            {/* h-full: 남은 공간 다 씀, overflow-y-auto: 넘치면 스크롤, p-8: 내부 여백, pb-32: 버튼에 가려지지 않게 하단 여백 충분히 줌 */}
            <div className="h-full overflow-y-auto p-8 pb-32 scrollbar-hide">
              <h2 className="text-2xl text-center md:text-3xl font-bold mb-4 tracking-tight leading-tight">
                Club <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 font-black">
                  Membership
                </span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 break-keep">
                신규 동아리 가입을 위한 단체 지원 프로세스입니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <p className="text-sm text-gray-400 font-medium">
                    활동 계획서 및 동아리 소개서 필수
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <p className="text-sm text-gray-400 font-medium">
                    PDF 형식 변환 제출 준수
                  </p>
                </div>
              </div>
            </div>

            {/* 버튼: absolute로 바닥에 고정 (스크롤 영역 밖) */}
            <button className="absolute bottom-8 left-8 right-8 h-[56px] bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden group/btn cursor-pointer flex items-center justify-center z-10">
              <span className="relative z-10">지원서 양식 다운로드</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>

            {/* 버튼 뒤가 투명해서 글자가 비치지 않게 그라데이션 마스크 처리 (선택사항, 디테일용) */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>

          {/* [오른쪽] Individual Membership */}
          {/* 동일하게 수정 */}
          <div className="group relative flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all duration-500 overflow-hidden flex flex-col">
            {/* 텍스트 스크롤 영역 */}
            <div className="h-full overflow-y-auto p-8 pb-32 scrollbar-hide">
              <h2 className="text-center text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">
                Individual <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-gray-400 font-black">
                  Membership
                </span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 break-keep">
                UIC 정회원 등록을 위한 개인 지원서입니다. 소속 동아리가 UIC
                네트워크에 가입되어 있어야 합니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                  <p className="text-sm text-gray-400 font-medium">
                    소속 동아리장 승인 확인 필수
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                  <p className="text-sm text-gray-400 font-medium">
                    학기별 정해진 기한 내 제출
                  </p>
                </div>
              </div>
            </div>

            {/* 버튼 고정 */}
            <button className="absolute bottom-8 left-8 right-8 h-[56px] bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden group/btn cursor-pointer flex items-center justify-center z-10">
              <span className="relative z-10">지원서 양식 다운로드</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>

            {/* 하단 마스크 */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <FooterBar />
    </section>
  );
};

export default JoinUs;
