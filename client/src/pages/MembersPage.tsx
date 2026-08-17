// src/pages/MembersPage.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { api } from '../api/api';

// 백엔드 데이터 타입 정의
interface Member {
  id: number;
  name: string;
  position: string;
  generation: number;
  imageUrl?: string;
  workplace?: string;
  email?: string;
}

// 직책 정렬 순서
const rolePriority = [
  '회장',
  '부회장',
  '기획',
  '대외협력',
  '마케팅',
  '재무',
  '인사',
  '부원',
];

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [activeGen, setActiveGen] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLElement>(null);

  // 1. 데이터 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.getMembers();
        const data = res.data;
        setMembers(data);

        if (data.length > 0) {
          const uniqueGens = Array.from(
            new Set(data.map((m: Member) => m.generation)),
          ) as number[];
          const latestGen = Math.max(...uniqueGens);
          setActiveGen(latestGen);
        }
      } catch (err) {
        console.error('멤버 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // 기수 전환 시 멤버 리스트를 항상 맨 위부터 보여준다.
  // 페인트 전에 실행되므로 이전 스크롤 위치가 잠깐 보이는 일이 없다.
  useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [activeGen]);

  // 2. 기수 목록 추출
  const generations = Array.from(
    new Set(members.map((m) => m.generation)),
  ).sort((a, b) => b - a);

  // 3. 필터링 및 정렬
  const currentMembers = members
    .filter((m) => m.generation === activeGen)
    .sort((a, b) => {
      const idxA = rolePriority.indexOf(a.position);
      const idxB = rolePriority.indexOf(b.position);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-white pt-24 md:pt-32 pb-6 md:pb-10">
      {/* 배경 효과 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* 기존 px-6를 sm:px-6로 두고 모바일은 px-4로 축소 */}
      <div className="relative mt-12 z-10 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 h-full">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-20 w-full h-full bg-black/20 backdrop-blur-md p-4 sm:p-6 md:p-12 overflow-hidden border border-white/5 shadow-2xl rounded-2xl md:rounded-none">
          {/* [좌측] 기수 선택 사이드바 */}
          <aside className="w-full lg:w-40 h-auto lg:h-full shrink-0 z-20 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 pb-2 md:pb-4 lg:pb-0 lg:pr-6">
            <h2 className="text-gray-500 text-[10px] md:text-xs font-black tracking-[0.3em] uppercase mb-2 md:mb-4 lg:mb-8 select-none px-1">
              Generations
            </h2>
            <nav className="flex flex-row lg:flex-col gap-2 md:gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 pr-2 custom-scrollbar scrollbar-hide lg:scrollbar-default">
              {generations.length === 0 ? (
                <div className="text-gray-600 text-sm">데이터 없음</div>
              ) : (
                generations.map((gen) => (
                  <button
                    key={gen}
                    onClick={() => setActiveGen(gen)}
                    className={`border-l-4 pl-3 md:pl-4 pr-3 md:pr-4 py-2 md:py-3 text-xs md:text-base text-left font-bold transition-colors duration-200 whitespace-nowrap lg:whitespace-normal cursor-pointer ${
                      activeGen === gen
                        ? 'border-blue-500 text-white'
                        : 'border-transparent text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    {gen}th{' '}
                    <span className="text-[8px] md:text-[10px] opacity-40 ml-1">
                      Gen
                    </span>
                  </button>
                ))
              )}
            </nav>
          </aside>

          {/* [우측] 멤버 리스트 영역 */}
          <section
            ref={listRef}
            className="flex-1 h-full overflow-y-auto pr-2 md:pr-4 z-20 scrollbar-hide"
          >
            <header className="mb-8 md:mb-16">
              <div className="group w-fit">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white/80">
                  {activeGen !== 19
                    ? `Alumni ${activeGen}th`
                    : `${activeGen}th`}
                </h1>
                <div className="w-full h-[2px] md:h-[3px] bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mt-2 md:mt-4 transition-all duration-500 group-hover:scale-x-110" />
              </div>
              <p className="mt-4 md:mt-6 text-white font-medium tracking-widest text-xs md:text-sm uppercase">
                {activeGen !== 19
                  ? `UIC의 역사를 함께 만든 `
                  : `UIC의 새로운 역사를 함께할 `}
                <span className="font-bold text-base md:text-lg">
                  {activeGen}대 회장단
                </span>
                을 소개합니다.
              </p>
            </header>

            {/* 멤버 카드 그리드: 모바일에서 무조건 2열(grid-cols-2)로 보이게 수정 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-5 lg:gap-6 pb-10 md:pb-20 justify-items-center lg:justify-items-start">
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group w-full max-w-[280px] relative bg-white/[0.03] backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-500 hover:border-blue-500/50 shadow-2xl hover:-translate-y-1"
                  >
                    {/* 1. 이미지 영역 (4:5 비율 고정) */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 flex items-center justify-center">
                      <img
                        src={
                          member.imageUrl
                            ? member.imageUrl.startsWith('http')
                              ? member.imageUrl
                              : `${import.meta.env.VITE_API_URL}${member.imageUrl}`
                            : assets.logo_uic
                        }
                        className={`object-cover transition-all duration-700 ${
                          member.imageUrl
                            ? 'w-full h-full opacity-100 group-hover:scale-105'
                            : 'w-1/2 opacity-30 group-hover:opacity-50 grayscale'
                        }`}
                        alt={member.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    </div>

                    {/* 2. 텍스트 정보 영역 (모바일 패딩 축소 p-3 md:p-5) */}
                    <div className="p-3 md:p-5 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col gap-1 md:gap-2">
                        {/* 직책 */}
                        <span className="w-fit text-[8px] md:text-[10px] font-black text-cyan-400 tracking-[0.1em] bg-black/60 backdrop-blur-md px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-cyan-400/30">
                          {member.position}
                        </span>

                        <div className="mt-1 flex flex-col gap-0.5 md:gap-1 overflow-hidden">
                          {/* 이름 */}
                          <h3 className="text-base md:text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                            {member.name}
                          </h3>

                          {/* 🏢 직장/소속 */}
                          {member.workplace && (
                            <p className="text-[10px] md:text-xs text-gray-300 font-medium truncate flex items-center gap-1.5">
                              {member.workplace}
                            </p>
                          )}

                          {/* 📧 이메일 */}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-[10px] md:text-xs text-gray-300 hover:text-white font-medium truncate flex items-center gap-1.5 transition-colors"
                            >
                              {member.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-gray-500 text-center w-full">
                  등록된 멤버가 없습니다.
                </div>
              )}
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
