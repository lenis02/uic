'use client';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import ViewAllModal from '../../components/ViewAllModal';

interface Partner {
  id: number;
  name: string;
  logoUrl: string | null;
}

const PartnerTile = ({ partner }: { partner: Partner }) => (
  <div className="uic-tile uic-tile-wide h-full">
    <div className="uic-logo">
      {partner.logoUrl ? (
        <img src={partner.logoUrl} alt={partner.name} loading="lazy" />
      ) : (
        <span className="text-sm font-bold text-gray-400 text-center break-keep">
          {partner.name}
        </span>
      )}
    </div>
  </div>
);

const UICPartner = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api
      .getPartners()
      .then((res) => setPartners(res.data))
      .catch(() => console.error('협력사 목록 불러오기 실패'));
  }, []);

  // Network와 동일하게 목록을 두 번 이어붙여 끊김 없는 루프를 만든다.
  const marqueeItems = [...partners, ...partners];

  return (
    <section
      id="partner"
      className="relative min-h-screen w-full md:snap-start flex flex-col items-center justify-center overflow-hidden px-6 py-24 md:py-28"
    >
      {/* 헤더 */}
      <div className="text-center mb-8 md:mb-12 shrink-0 z-10">
        <span className="block text-[13px] md:text-sm font-semibold tracking-[0.3em] text-pink-300 mb-3">
          PARTNERS
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug break-keep">
          금융의 미래를 함께 만드는 파트너
        </h2>
      </div>

      {/* 1행 무한 마퀴 */}
      <div className="uic-marqwrap z-10">
        <div className="uic-marq-track uic-marq-part">
          {marqueeItems.map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className="uic-marq-item-wide">
              <PartnerTile partner={partner} />
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
        전체 파트너 한번에 보기
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
          label="PARTNERS"
          labelColor="#f9a8d4"
          title="UIC 파트너"
          onClose={() => setShowAll(false)}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {partners.map((partner) => (
              <PartnerTile key={partner.id} partner={partner} />
            ))}
          </div>
        </ViewAllModal>
      )}
    </section>
  );
};

export default UICPartner;
