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
    api.getActivePopups().then((res) => {
      const today = new Date().toDateString();
      const dismissedToday: number[] = JSON.parse(localStorage.getItem(`dismissedPopups_${today}`) || '[]');
      const filtered = res.data.filter((p: Popup) => !dismissedToday.includes(p.id));
      setPopups(filtered);
    }).catch(() => {});
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
    <div className="fixed inset-0 z-[9999] flex items-end justify-center gap-4 pb-0 pointer-events-none">
      {/* 배경 딤 — 팝업이 1개 이상이면 표시 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" />

      <div className="relative flex items-center justify-center gap-6 flex-wrap px-6 pointer-events-auto w-full h-full">
        {popups.map((popup) => (
          <div
            key={popup.id}
            className="bg-slate-900 border border-white/10 shadow-2xl w-[90vw] max-w-sm overflow-hidden"
          >
            <div
              className={popup.linkUrl ? 'cursor-pointer' : ''}
              onClick={() => popup.linkUrl && window.open(popup.linkUrl, '_blank')}
            >
              <img src={popup.imageUrl} alt="popup" className="w-full object-cover" />
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
    </div>
  );
}
