import React from 'react';

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
      <div className="relative z-10 text-center mb-16 select-none">
        <h1 className="text-3xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          JOIN US
        </h1>
        {/* 네온 선 가로 길이 조절 및 그림자 추가 */}
        <div className="h-[2px] w-24 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mx-auto mt-4 mb-4" />
        <p className="text-sm md:text-lg text-gray-400 font-medium tracking-widest uppercase break-keep px-4">
          UIC와 함께 성장을 도모할 열정적인 분을 기다립니다.
        </p>
      </div>

      {/* 메인 카드 컨테이너 */}
      <div className="relative z-10 w-[90%] max-w-[1100px] h-auto md:h-[60%] rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-md" />

        <div className="relative h-full w-full flex flex-col md:flex-row p-6 md:p-10 gap-6">
          {/* [왼쪽] Club Membership (Purple 테마) */}
          <div className="group flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl rounded-[32px] p-8 border border-white/10 transition-all duration-500 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl text-center md:text-3xl font-bold mb-4 tracking-tight leading-tight">
                Club <br />
                {/* 보라색 그라데이션 - text-transparent 필수! */}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 font-black">
                  Membership
                </span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 break-keep">
                신규 동아리 가입을 위한 단체 지원 프로세스입니다.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <p className="text-xs text-gray-400 font-medium">
                    활동 계획서 및 동아리 소개서 필수
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                  <p className="text-xs text-gray-400 font-medium">
                    PDF 형식 변환 제출 준수
                  </p>
                </div>
              </div>
            </div>

            <button className="relative cursor-pointer overflow-hidden group/btn mt-8 w-full py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
              <span className="relative z-10">지원서 양식 다운로드</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* [오른쪽] Individual Membership (Cyan-Blue 테마) */}
          <div className="group flex-1 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl rounded-[32px] p-8 border border-white/10 transition-all duration-500 flex flex-col justify-between">
            <div>
              <h2 className="text-center text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">
                Individual <br />
                {/* 텍스트 그라데이션 수정 (bg-clip-text + text-transparent 조합) */}
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
                  <p className="text-xs text-gray-400 font-medium">
                    소속 동아리장 승인 확인 필수
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#22d3ee]" />
                  <p className="text-xs text-gray-400 font-medium">
                    학기별 정해진 기한 내 제출
                  </p>
                </div>
              </div>
            </div>

            <button className="relative cursor-pointer overflow-hidden group/btn mt-8 w-full py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
              <span className="relative z-10">지원서 양식 다운로드</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-12 text-gray-600 text-[10px] tracking-[0.3em] uppercase select-none font-light">
        United Investment Clubs of Korea
      </p>
    </section>
  );
};

// !!! 이 부분이 가장 중요합니다 (에러 해결 핵심) !!!
export default JoinUs;
