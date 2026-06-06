import { useEffect, useState } from 'react';
import { api } from '../api/api';

interface Popup {
  id: number;
  imageUrl: string;
  linkUrl?: string;
}

export default function PopupBanner() {
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    api
      .getActivePopups()
      .then((res) => {
        const today = new Date().toDateString();
        const dismissedToday: number[] = JSON.parse(
          localStorage.getItem(`dismissedPopups_${today}`) || '[]',
        );
        const filtered = res.data.filter(
          (p: Popup) => !dismissedToday.includes(p.id),
        );
        setPopups(filtered);
      })
      .catch(() => {});
  }, []);

  const dismiss = (id: number) => {
    const today = new Date().toDateString();
    const key = `dismissedPopups_${today}`;
    const list: number[] = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...list, id]));
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  const close = (id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  };

  if (popups.length === 0) return null;

  return (
    // 모바일: 어두운 배경 오버레이 + 중앙 정렬 / 데스크탑(md~): 좌상단 배치 + 바깥 클릭 통과
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 pointer-events-auto md:block md:bg-transparent md:pointer-events-none">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="relative pointer-events-auto bg-slate-900 border border-white/10 shadow-2xl overflow-hidden w-fit md:absolute md:top-0 md:left-0"
        >
          <div
            className={popup.linkUrl ? 'cursor-pointer' : ''}
            onClick={() =>
              popup.linkUrl && window.open(popup.linkUrl, '_blank')
            }
          >
            <img
              src={popup.imageUrl}
              alt="popup"
              className="block w-auto h-auto max-w-[72vw] max-h-[65vh] md:max-w-lg md:max-h-[78vh] object-contain"
            />
          </div>

          <div className="flex justify-between items-center px-4 py-3 border-t border-white/10">
            <button
              onClick={() => dismiss(popup.id)}
              className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              오늘 하루 보지 않기
            </button>
            <button
              onClick={() => close(popup.id)}
              className="text-xs text-white cursor-pointer px-3 py-1 border border-white/30 hover:border-white transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
