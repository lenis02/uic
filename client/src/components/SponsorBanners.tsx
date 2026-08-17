import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/api';

type AdPlacement = 'top' | 'bottom';

interface Advertisement {
  id: number;
  placement: AdPlacement;
  imageUrl: string;
  linkUrl: string | null;
  altText: string;
}

interface PlacementGroup {
  placement: AdPlacement;
  barHeight: number;
  ads: Advertisement[];
}

// 하단 바를 닫으면 이 키를 남겨 다시 뜨지 않게 한다.
const BOTTOM_CLOSED_KEY = 'uic_ad_bottom_closed';
// 같은 위치에 광고가 여러 개면 이 간격으로 순환한다.
const ROTATE_INTERVAL_MS = 5000;

const useRotatingAd = (ads: Advertisement[]) => {
  // 인덱스를 직접 들고 있지 않고 tick만 올린 뒤 나머지 연산으로 고른다.
  // 목록 길이가 바뀌어도 범위를 벗어나지 않는다.
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

// 띠 전체를 이미지가 채운다. 라벨/닫기 버튼은 그 위에 겹쳐 올린다.
const AdImage = ({ ad }: { ad: Advertisement }) => {
  const image = (
    <img
      src={ad.imageUrl}
      alt={ad.altText || '스폰서 배너'}
      className="w-full h-full object-cover"
    />
  );

  if (!ad.linkUrl) return <div className="w-full h-full">{image}</div>;

  return (
    <a
      href={ad.linkUrl}
      target="_blank"
      rel="noopener sponsored"
      className="block w-full h-full"
    >
      {image}
    </a>
  );
};

// 이미지 위에 얹는 광고 표기. 레이아웃 폭을 차지하지 않도록 absolute.
const AdLabel = ({
  text,
  color,
  className,
}: {
  text: string;
  color: string;
  className: string;
}) => (
  <span
    style={{ color }}
    className={`absolute top-1/2 -translate-y-1/2 z-10 px-1.5 py-0.5 rounded bg-black/45 backdrop-blur-sm text-[10px] font-bold tracking-[0.2em] pointer-events-none ${className}`}
  >
    {text}
  </span>
);

const TopStrip = ({ group, offset }: { group: PlacementGroup; offset: number }) => {
  const ad = useRotatingAd(group.ads);
  if (!ad) return null;

  return (
    <div
      style={{ top: offset, height: group.barHeight }}
      // 네비(z-100)보다 아래, 콘텐츠보다 위.
      className="fixed left-0 right-0 z-[80] overflow-hidden border-y border-white/10"
    >
      <AdImage ad={ad} />
      <AdLabel text="SPONSORED" color="#c4b5fd" className="left-3" />
    </div>
  );
};

const BottomBar = ({ group }: { group: PlacementGroup }) => {
  const [closed, setClosed] = useState(
    () => localStorage.getItem(BOTTOM_CLOSED_KEY) === '1',
  );
  const ad = useRotatingAd(group.ads);

  if (closed || !ad) return null;

  const handleClose = () => {
    setClosed(true);
    localStorage.setItem(BOTTOM_CLOSED_KEY, '1');
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ height: group.barHeight }}
      // 모바일 네비 드로어(z-90)보다는 아래에 둔다.
      className="fixed left-0 right-0 bottom-0 z-[85] overflow-hidden border-t border-white/[0.12]"
    >
      <AdImage ad={ad} />
      <AdLabel text="AD" color="#93c5fd" className="left-4 md:left-[18px]" />
      <button
        type="button"
        onClick={handleClose}
        aria-label="광고 닫기"
        className="absolute right-4 md:right-[18px] top-1/2 -translate-y-1/2 z-10 w-[26px] h-[26px] rounded-full bg-black/45 backdrop-blur-sm text-[#cfcfe0] text-[15px] leading-none flex items-center justify-center hover:bg-black/65 transition-colors cursor-pointer"
      >
        ×
      </button>
    </motion.div>
  );
};

const SponsorBanners = () => {
  const [groups, setGroups] = useState<PlacementGroup[]>([]);
  // 네비 높이가 반응형으로 크게 달라져서(데스크탑 160px) 실측해서 붙인다.
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.getAdvertisements();
        setGroups(res.data);
      } catch (err) {
        console.error('광고 로딩 실패:', err);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const nav = document.getElementById('main-navbar');
    if (!nav) return;

    const update = () => setNavHeight(nav.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  const top = groups.find((g) => g.placement === 'top');
  const bottom = groups.find((g) => g.placement === 'bottom');

  return (
    <>
      {top && <TopStrip group={top} offset={navHeight} />}
      {bottom && <BottomBar group={bottom} />}
    </>
  );
};

export default SponsorBanners;
