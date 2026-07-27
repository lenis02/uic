import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import ViewAllModal from '../../components/ViewAllModal';

interface University {
  id: number;
  name: string;
  logoUrl: string | null;
  // 로고 자체가 밝은 색이라 흰 배경에서는 보이지 않는 경우
  darkBg: boolean;
}

const UniversityTile = ({ uni }: { uni: University }) => (
  <div className="uic-tile h-full">
    <div className={`uic-logo ${uni.darkBg ? 'uic-logo-dark' : ''}`}>
      {uni.logoUrl ? (
        <img src={uni.logoUrl} alt={uni.name} loading="lazy" />
      ) : (
        <span
          className={`text-[9px] font-bold text-center px-1 break-keep ${
            uni.darkBg ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {uni.name}
        </span>
      )}
    </div>
    <span className="text-[13px] font-semibold text-gray-200 text-center leading-tight break-keep">
      {uni.name}
    </span>
  </div>
);

const UICNetwork = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api
      .getNetworks()
      .then((res) => setUniversities(res.data))
      .catch(() => console.error('참여 대학 목록 불러오기 실패'));
  }, []);

  // 끊김 없는 무한 루프를 위해 목록을 두 번 이어붙인다.
  // 트랙 전체가 정확히 2배이므로 -50%까지 이동하면 시작 지점과 동일해진다.
  const marqueeItems = [...universities, ...universities];

  return (
    <section
      id="network"
      className="relative min-h-screen w-full md:snap-start flex flex-col items-center justify-center overflow-hidden px-6 py-24 md:py-28"
    >
      {/* 헤더 */}
      <div className="text-center mb-8 md:mb-11 shrink-0 z-10">
        <span className="block text-[13px] md:text-sm font-semibold tracking-[0.3em] text-purple-300 mb-3">
          NETWORK
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug break-keep">
          전국 <span className="text-purple-300">{universities.length}개</span>{' '}
          대학 투자동아리와 함께
        </h2>
      </div>

      {/* 1행 무한 마퀴 */}
      <div className="uic-marqwrap z-10">
        <div className="uic-marq-track uic-marq-net">
          {marqueeItems.map((uni, idx) => (
            <div key={`${uni.id}-${idx}`} className="uic-marq-item">
              <UniversityTile uni={uni} />
            </div>
          ))}
        </div>
      </div>

      {/* 전체 보기 */}
      <button
        type="button"
        className="uic-viewall mt-8 md:mt-10 z-10"
        onClick={() => setShowAll(true)}
      >
        전체 대학 한번에 보기
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {showAll && (
        <ViewAllModal
          label="NETWORK"
          labelColor="#c4b5fd"
          title={`전국 ${universities.length}개 대학 투자동아리`}
          onClose={() => setShowAll(false)}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-[18px]">
            {universities.map((uni) => (
              <UniversityTile key={uni.id} uni={uni} />
            ))}
          </div>
        </ViewAllModal>
      )}
    </section>
  );
};

export default UICNetwork;
