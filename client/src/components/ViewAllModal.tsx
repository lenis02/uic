import { useEffect, type ReactNode } from 'react';

interface ViewAllModalProps {
  /** 상단 작은 라벨 (예: NETWORK) */
  label: string;
  /** 라벨 색상 */
  labelColor: string;
  /** 모달 제목 */
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * §3 Network / §4 Partners의 "전체 보기" 모달 껍데기.
 * 마퀴는 일부만 흘러가므로, 전체 목록을 한 번에 확인할 수 있는 통로가 필요하다.
 */
const ViewAllModal = ({
  label,
  labelColor,
  title,
  onClose,
  children,
}: ViewAllModalProps) => {
  // ESC로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="uic-modal-back" onClick={onClose}>
      <div className="uic-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uic-modal-head">
          <div>
            <div
              className="text-[13px] font-semibold tracking-[0.28em]"
              style={{ color: labelColor }}
            >
              {label}
            </div>
            <div className="text-[clamp(19px,1.8vw,25px)] font-extrabold mt-1.5 text-white">
              {title}
            </div>
          </div>
          <button
            type="button"
            className="uic-modal-close"
            onClick={onClose}
            aria-label="닫기"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="uic-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default ViewAllModal;
