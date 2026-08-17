import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import FooterBar from '../components/FooterBar';
import { api } from '../api/api';

interface Activity {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
}

// 관리자 화면에서 이미지를 올리기 전까지는 기존 번들 이미지를 그대로 쓴다.
// 번들 이미지는 빌드 때 해시가 붙어서 DB에 URL로 심어둘 수 없기 때문.
const FALLBACK_IMAGES: Record<string, string> = {
  정기총회: assets.activity1,
  연합세션: assets.activity2,
  투자콘서트: assets.activity3,
  직무콘서트: assets.activity4,
};

const resolveImage = (activity: Activity) => {
  if (!activity.imageUrl) return FALLBACK_IMAGES[activity.title] ?? '';
  return activity.imageUrl.startsWith('http')
    ? activity.imageUrl
    : `${import.meta.env.VITE_API_URL}${activity.imageUrl}`;
};

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.getActivities();
        setActivities(res.data);
      } catch (err) {
        console.error('활동 로딩 실패:', err);
      }
    };

    fetchActivities();
  }, []);

  return (
    // h-[100dvh]를 사용하여 모바일 브라우저의 상하단 바 이슈 방지
    <main className="relative w-full h-[100dvh] overflow-y-auto md:snap-y md:snap-mandatory bg-[#050505] text-white scrollbar-hide">
      {/* 고정 배경 */}
      <img
        src={assets.bg_activity}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      {/* [첫 번째 섹션] 헤더 섹션 */}
      <section className="relative w-full h-[100dvh] flex flex-col justify-center items-center md:snap-start z-10 px-4 md:px-6">
        <div className="flex flex-col items-center max-w-[1000px] justify-center mx-auto text-center mt-10 md:mt-0">
          <div className="group w-fit flex flex-col items-center">
            {/* 모바일 폰트 사이즈 살짝 축소 (text-4xl), 데스크탑 유지 (md:text-5xl lg:text-6xl) */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white/80 mb-4 md:mb-6 animate-fadeIn text-center">
              UIC Activities
            </h1>
            {/* 하단 바 */}
            <div className="w-full -mt-1 md:-mt-2 h-[4px] md:h-[7px] rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-500 group-hover:scale-x-110" />
          </div>

          {/* 폰트 축소 및 여백 조정 */}
          <p className="mt-6 md:mt-8 text-sm md:text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl px-2 md:px-0 break-keep">
            전국 대학생 투자동아리 연합회 UIC와 함께하며{' '}
            <br className="hidden md:block" /> 금융에 대한 깊은 통찰과 진정한
            성장을 경험해 보세요.
          </p>
          <div className="mt-12 md:mt-20 animate-bounce text-blue-500 opacity-50">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* [활동 섹션들] */}
      {/* 좌우 배치는 렌더 순서 기준으로 번갈아간다. 첫 번째는 이미지(좌)/설명(우). */}
      {activities.map((act, index) => (
        <section
          key={act.id}
          // 모바일 패딩 조정 px-4
          className="relative w-full h-[100dvh] flex items-center justify-center md:snap-start z-10 px-8 md:px-20"
        >
          <div
            // 변경점 1: 가로 배치 전환 시점을 md에서 xl로 변경
            className={`mt-0 md:mt-12 flex flex-col gap-6 md:gap-12 items-center justify-center max-w-[1400px] w-full h-full ${
              index % 2 === 1 ? 'xl:flex-row-reverse' : 'xl:flex-row'
            }`}
          >
            {/* 이미지 카드 (모바일, md에서는 위쪽 배치) */}
            {/* 변경점 2: flex-1 적용 시점을 xl로 변경 */}
            <div className="w-full max-w-[600px] xl:flex-1 group relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              {/* 모바일 aspect-video 유지 */}
              <div className="relative aspect-video md:aspect-[3/2] rounded-xl md:rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-2xl">
                <img
                  src={resolveImage(act)}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* 텍스트 설명 */}
            {/* 변경점 3: 텍스트 고정 너비 적용 시점을 xl로 변경 (위아래 배치일 땐 넓게 쓰도록) */}
            <div className="w-full xl:w-[500px] space-y-4 md:space-y-8 px-2 md:mx-auto">
              <div>
                {/* 변경점 4: 좌측 정렬 시점을 xl로 변경하여 md에서도 중앙 정렬 유지 */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white/95 text-center xl:text-left">
                  {act.title}
                </h2>
              </div>

              {/* 리스트 여백 축소 (space-y-3) */}
              <ul className="space-y-3 md:space-y-5 xl:translate-x-[0%] md:translate-x-[12%]">
                {act.description
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((desc, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 md:gap-4 group/item"
                    >
                      {/* 모바일 도트 위치 미세 조정 */}
                      <div className="mt-1.5 md:mt-2.5 w-1.5 h-1.5 md:w-2 md:h-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover/item:scale-125 transition-all" />
                      <p
                        // 모바일 텍스트 축소 (text-sm), 긴 글자 안 깨지게 break-keep 적용
                        className="text-gray-300 text-sm md:text-lg lg:text-lg group-hover/item:text-white transition-colors leading-relaxed break-keep"
                        dangerouslySetInnerHTML={{ __html: desc }}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* 마지막 활동 아래 여백에 JoinUs로 넘어가는 CTA 배치 */}
          {index === activities.length - 1 && (
            <Link
              to="/join"
              className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl border border-white/60 text-white text-sm md:text-base font-bold tracking-tight transition-all duration-300 hover:bg-white/10 hover:border-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              지금 바로 지원하기
            </Link>
          )}
        </section>
      ))}

      {/* [마지막 섹션] 푸터 */}
      <section className="relative w-full h-fit md:snap-end z-10 bg-black/50">
        <FooterBar />
      </section>
    </main>
  );
};

export default ActivityPage;
