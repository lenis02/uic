const JoinUs = () => {
  return (
    <section
      id="join"
      className="relative h-screen w-full snap-start flex flex-col items-center bg-[#050505] text-white overflow-hidden pt-32"
    >
      {/* 배경 장식 (은은한 그라데이션 빛) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/20 blur-[120px] rounded-full" />

      {/* 상단 타이틀 영역 */}
      <div className="relative z-10 text-center mb-16 select-none">
        <h1 className="text-3xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          JOIN US
        </h1>
        <div className="h-[1px] w-12 bg-purple-500 mx-auto mt-4 mb-4" />
        <p className="text-m md:text-lg text-gray-400 font-semibold tracking-widest uppercase">
          UIC와 함께 성장을 도모할 열정적인 분을 기다립니다.
        </p>
      </div>

      {/* 메인 카드 컨테이너 */}
      <div
        className="relative z-10 w-[90%] max-w-[1100px] aspect-[16/9] md:aspect-auto md:h-[65%] rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
        // style={{
        //   backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${assets.bg_joinus})`,
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        // }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

        {/* 좌우 카드 섹션 */}
        <div className="relative h-full w-full flex flex-col md:flex-row p-6 md:p-12 gap-8">
          {/* 왼쪽: Club Membership */}
          <div className="group flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl rounded-[32px] p-8 border border-white/10 transition-all duration-500 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl text-center md:text-3xl font-bold mb-3 tracking-tight">
                Club <br />
                <span className="text-purple-500">Membership</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                신규 동아리 가입을 위한 단체 지원 프로세스입니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <p className="text-xs text-gray-400">
                    활동 계획서 및 동아리 소개서 필수
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <p className="text-xs text-gray-400">
                    PDF 형식 변환 제출 준수
                  </p>
                </div>
              </div>
            </div>

            <button className="relative overflow-hidden group/btn mt-8 w-full py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95">
              <span className="relative z-10">지원서 양식 다운로드</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* 오른쪽: Individual Membership */}
          <div className="group flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl rounded-[32px] p-8 border border-white/10 transition-all duration-500 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl text-center md:text-3xl font-bold mb-3 tracking-tight">
                Individual
                <br /> <span className="text-blue-500">Membership</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                UIC 정회원 등록을 위한 개인 지원서입니다.
                <br />
                소속된 동아리가 UIC 네트워크에 가입되어 있어야 합니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                  <p className="text-xs text-gray-400">
                    소속 동아리장 승인 확인 필수
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                  <p className="text-xs text-gray-400">
                    학기별 정해진 기한 내 제출
                  </p>
                </div>
              </div>
            </div>

            <button className="relative overflow-hidden group/btn mt-8 w-full py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95">
              <span className="relative z-10">지원서 양식 다운로드</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* 하단 푸터 느낌의 안내 */}
      <p className="mt-12 text-gray-600 text-xs tracking-widest uppercase select-none">
        United Investment Clubs of Korea
      </p>
    </section>
  );
};

export default JoinUs;
