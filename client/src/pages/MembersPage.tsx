import { useState } from 'react';
import { assets } from '../../assets/assets';

// 데이터 구조에 image 필드 추가
const alumniData = Array.from({ length: 19 }, (_, i) => ({
  generation: 19 - i,
  members: [
    {
      name: '이동원',
      role: '회장',
      image: assets.logo_uic,
    }, // assets에 실제 이미지 경로가 있다면 교체
    {
      name: '황민성',
      role: '부회장',
      image: assets.logo_uic,
    },
    {
      name: '송민규',
      role: '기획',
      image: assets.logo_uic,
    },
    {
      name: '이승호',
      role: '대외협력',
      image: assets.logo_uic,
    },
    {
      name: '지수민',
      role: '마케팅',
      image: assets.logo_uic,
    },
    {
      name: '장소연',
      role: '재무',
      image: assets.logo_uic,
    },
    {
      name: ' ',
      role: '인사',
      image: assets.logo_uic,
    },
  ],
}));

const MembersPage = () => {
  const [activeGen, setActiveGen] = useState(19);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-white pt-32 pb-10">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="relative mt-8 z-10 max-w-[1600px] mx-auto px-6 md:px-12 h-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 w-full h-full bg-black/20 backdrop-blur-md p-6 md:p-12 overflow-hidden border border-white/5 shadow-2xl ">
          {/* [좌측] 기수 선택 사이드바 */}
          <aside className="w-full lg:w-40 h-auto lg:h-full shrink-0 z-20 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-6">
            <h2 className="text-gray-500 text-xs font-black tracking-[0.3em] uppercase mb-4 lg:mb-8 select-none px-1">
              Generations
            </h2>
            <nav className="flex flex-row lg:flex-col gap-2 md:gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 pr-2 custom-scrollbar scrollbar-hide lg:scrollbar-default">
              {alumniData.map((data) => (
                <button
                  key={data.generation}
                  onClick={() => setActiveGen(data.generation)}
                  className={`px-4 py-3 rounded-xl text-left font-bold transition-all duration-300 whitespace-nowrap lg:whitespace-normal cursor-pointer ${
                    activeGen === data.generation
                      ? 'text-blue-400 bg-blue-400/10 border-b-4 lg:border-b-0 lg:border-r-4 border-blue-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {data.generation}th{' '}
                  <span className="text-[10px] opacity-40 ml-1">Gen</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* [우측] 멤버 리스트 영역 */}
          <section className="flex-1 h-full overflow-y-auto pr-4 z-20 scrollbar-hide">
            <header className="mb-16">
              <div className="group w-fit">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white/80">
                  Alumni {activeGen}th.
                </h1>
                <div className="w-full h-[3px] bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mt-4 transition-all duration-500 group-hover:scale-x-110" />
              </div>
              <p className="mt-6 text-white font-medium tracking-widest text-sm uppercase">
                UIC의 역사를 함께 만든{' '}
                <span className="font-bold text-lg">{activeGen}대 임원진</span>
                을 소개합니다.
              </p>
            </header>

            {/* 멤버 카드 그리드: 이미지 비율에 맞춰 간격 조절 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6 pb-20 justify-items-center lg:justify-items-start">
              {' '}
              {alumniData
                .find((d) => d.generation === activeGen)
                ?.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="group max-w-[280px] cursor-pointer relative bg-white/[0.03] backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/50 shadow-2xl"
                  >
                    {/* 1. 이미지 영역 (4:5 비율 고정) */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                      <img
                        src={member.image}
                        className="w-full h-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100"
                        alt={member.name}
                      />
                      {/* 이미지 위 오버레이 그라데이션 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                      {/* 배지 (이미지 위 배치) */}
                    </div>

                    {/* 2. 텍스트 정보 영역 */}
                    <div className="p-6 relative">
                      {/* 호버 시 나타나는 배경 광채 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                          <span className="w-fit text-[10px] font-black text-cyan-400 tracking-[0.1em] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-400/30">
                            {member.role}
                          </span>
                          <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {member.name}
                          </h3>
                        </div>
                        <img
                          src={assets.logo_uic}
                          className="w-6 opacity-20 group-hover:opacity-60 transition-opacity mb-1"
                          alt="uic"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-[-5%] right-[-2%] text-[15vw] font-black text-white/[0.02] italic pointer-events-none select-none uppercase">
        Network.
      </div>
    </main>
  );
};

export default MembersPage;
