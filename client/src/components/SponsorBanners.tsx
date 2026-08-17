import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { api } from '../api/api';

type AdType = 'anchored' | 'floating';
type AdSection = 'home' | 'vision' | 'network' | 'partner';
type AdEdge = 'top' | 'bottom';
type AdSide = 'left' | 'right';

interface Advertisement {
  id: number;
  type: AdType;
  section: AdSection | null;
  edge: AdEdge | null;
  side: AdSide | null;
  width: number;
  height: number;
  imageUrl: string;
  linkUrl: string | null;
  altText: string;
}

// 추적형 배너를 닫으면 이 키를 남겨 다시 뜨지 않게 한다.
const FLOATING_CLOSED_KEY = 'uic_ad_floating_closed';
// 같은 자리에 광고가 여러 개면 이 간격으로 순환한다.
const ROTATE_INTERVAL_MS = 5000;

const useRotatingAd = (ads: Advertisement[]) => {
  // 인덱스를 직접 들고 있지 않고 tick만 올린 뒤 나머지 연산으로 고른다.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (ads.length < 2) return;

    const timer = setInterval(
      () => setTick((prev) => prev + 1),
      ROTATE_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [ads.length]);

  if (ads.length === 0) return null;
  return ads[tick % ads.length];
};

const AdCreative = ({ ad }: { ad: Advertisement }) => {
  const image = (
    <img
      src={ad.imageUrl}
      alt={ad.altText || '스폰서 배너'}
      className="w-full h-full object-cover"
    />
  );

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg border border-white/10 shadow-2xl">
      {ad.linkUrl ? (
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="noopener sponsored"
          className="block w-full h-full"
        >
          {image}
        </a>
      ) : (
        image
      )}
      <span className="absolute left-2 top-2 z-10 px-1.5 py-0.5 rounded bg-black/45 backdrop-blur-sm text-[9px] font-bold tracking-[0.2em] text-white/70 pointer-events-none">
        AD
      </span>
    </div>
  );
};

/** 위치 고정형: 대상 섹션 안에 심어서 섹션과 함께 스크롤된다. */
const AnchoredAd = ({
  section,
  edge,
  ads,
}: {
  section: AdSection;
  edge: AdEdge;
  ads: Advertisement[];
}) => {
  const ad = useRotatingAd(ads);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById(section));
  }, [section]);

  if (!ad || !host) return null;

  return createPortal(
    <div
      style={{ width: ad.width, height: ad.height }}
      // 네비가 fixed로 모든 섹션 위를 덮으므로, 위쪽 자리는 네비 높이만큼 내려서 시작한다.
      className={`absolute left-1/2 -translate-x-1/2 z-20 max-w-[92%] ${
        edge === 'top' ? 'top-28 md:top-[170px]' : 'bottom-8 md:bottom-12'
      }`}
    >
      <AdCreative ad={ad} />
    </div>,
    host,
  );
};

/** 추적형: 좌우 여백에 고정되어 스크롤 내내 따라온다. */
const FloatingAd = ({ side, ads }: { side: AdSide; ads: Advertisement[] }) => {
  const [closed, setClosed] = useState(
    () => localStorage.getItem(`${FLOATING_CLOSED_KEY}_${side}`) === '1',
  );
  const ad = useRotatingAd(ads);

  if (closed || !ad) return null;

  const handleClose = () => {
    setClosed(true);
    localStorage.setItem(`${FLOATING_CLOSED_KEY}_${side}`, '1');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: ad.width, height: ad.height }}
      // 좌측은 섹션 내비 점(MainSidebar, left-8)을 피해 안쪽으로 들여둔다.
      // 여백이 없는 좁은 화면에서는 아예 띄우지 않는다.
      className={`hidden xl:block fixed top-1/2 -translate-y-1/2 z-[85] ${
        side === 'left' ? 'left-24' : 'right-6'
      }`}
    >
      <AdCreative ad={ad} />
      <button
        type="button"
        onClick={handleClose}
        aria-label="광고 닫기"
        className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm border border-white/15 text-[#cfcfe0] text-[13px] leading-none flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
      >
        ×
      </button>
    </motion.div>
  );
};

const SponsorBanners = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.getAdvertisements();
        setAds(res.data);
      } catch (err) {
        console.error('광고 로딩 실패:', err);
      }
    };

    fetchAds();
  }, []);

  // 같은 자리(섹션+위아래 / 좌우)끼리 묶어야 순환이 자리마다 따로 돈다.
  const anchoredSlots = new Map<string, Advertisement[]>();
  const floatingSlots = new Map<AdSide, Advertisement[]>();

  ads.forEach((ad) => {
    if (ad.type === 'anchored' && ad.section && ad.edge) {
      const key = `${ad.section}:${ad.edge}`;
      anchoredSlots.set(key, [...(anchoredSlots.get(key) ?? []), ad]);
    } else if (ad.type === 'floating' && ad.side) {
      floatingSlots.set(ad.side, [...(floatingSlots.get(ad.side) ?? []), ad]);
    }
  });

  return (
    <>
      {[...anchoredSlots.entries()].map(([key, slotAds]) => {
        const [section, edge] = key.split(':') as [AdSection, AdEdge];
        return (
          <AnchoredAd
            key={key}
            section={section}
            edge={edge}
            ads={slotAds}
          />
        );
      })}
      {[...floatingSlots.entries()].map(([side, slotAds]) => (
        <FloatingAd key={side} side={side} ads={slotAds} />
      ))}
    </>
  );
};

export default SponsorBanners;
