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
    <div className="fixed top-0 left-0 z-[9999] pointer-events-none">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute top-0 left-0 pointer-events-auto bg-slate-900 border border-white/10 shadow-2xl overflow-hidden w-fit"
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
              className="block w-auto h-auto max-w-[88vw] sm:max-w-lg max-h-[78vh] object-contain"
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
