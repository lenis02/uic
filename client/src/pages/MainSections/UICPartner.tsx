'use client';
import { useState } from 'react';
import { assets } from '../../../assets/assets';
import ViewAllModal from '../../components/ViewAllModal';

const partners = [
  { name: '삼성증권', logo: 'logo_coop0' },
  { name: '한국투자증권', logo: 'logo_coop1' },
  { name: '미래에셋증권', logo: 'logo_coop2' },
  { name: 'NH투자증권', logo: 'logo_coop3' },
  { name: 'KB증권', logo: 'logo_coop4' },
  { name: '신한투자증권', logo: 'logo_coop5' },
  { name: '하나증권', logo: 'logo_coop6' },
  { name: '키움증권', logo: 'logo_coop7' },
  { name: '대신증권', logo: 'logo_coop8' },
  { name: '메리츠증권', logo: 'logo_coop9' },
  { name: '토스증권', logo: 'logo_coop10' },
  { name: '카카오페이증권', logo: 'logo_coop11' },
  { name: '카', logo: 'logo_coop12' },
  { name: '카카오', logo: 'logo_coop13' },
];

type Partner = (typeof partners)[number];

const PartnerTile = ({ partner }: { partner: Partner }) => {
  const logoSrc = assets[partner.logo as keyof typeof assets];

  return (
    <div className="uic-tile uic-tile-wide h-full">
      <div className="uic-logo">
        {logoSrc ? (
          <img src={logoSrc} alt={partner.name} loading="lazy" />
        ) : (
          <span className="text-sm font-bold text-gray-400 text-center break-keep">
            {partner.name}
          </span>
        )}
      </div>
    </div>
  );
};

const UICPartner = () => {
  const [showAll, setShowAll] = useState(false);

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
            <div key={`${partner.name}-${idx}`} className="uic-marq-item-wide">
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
              <PartnerTile key={partner.name} partner={partner} />
            ))}
          </div>
        </ViewAllModal>
      )}
    </section>
  );
};

export default UICPartner;
