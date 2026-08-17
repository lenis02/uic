import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

type AdPlacement = 'top' | 'bottom';

interface Advertisement {
  id: number;
  placement: AdPlacement;
  imageUrl: string;
  linkUrl: string | null;
  altText: string;
  isActive: boolean;
  sortOrder: number;
}

interface PlacementGroup {
  placement: AdPlacement;
  barHeight: number;
  ads: Advertisement[];
}

// 띠 높이 허용 범위는 서버(BAR_HEIGHT_LIMITS)와 같은 값을 쓴다.
const PLACEMENTS: {
  key: AdPlacement;
  label: string;
  min: number;
  max: number;
  description: string;
}[] = [
  {
    key: 'top',
    label: '상단 스트립',
    min: 40,
    max: 58,
    description:
      '네비게이션 바로 아래에 항상 노출되는 얇은 가로 띠입니다. 히어로 영역을 밀어내지 않도록 최대 58px까지만 커집니다.',
  },
  {
    key: 'bottom',
    label: '하단 고정바',
    min: 40,
    max: 66,
    description:
      '화면 하단에 고정되어 스크롤 내내 따라옵니다. 방문자가 × 로 닫을 수 있습니다.',
  },
];

const labelStyle = 'block text-sm font-medium text-gray-300 mb-2';
const inputStyle =
  'w-full bg-slate-950/50 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-300 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

const errorMessage = (err: unknown) => {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join('\n') : (msg ?? '알 수 없는 오류');
};

/** 실제 배너와 같은 모양으로 그리고, 아래 모서리를 끌어 높이를 조절한다. */
function BarPreview({
  placement,
  height,
  min,
  max,
  imageUrl,
  onHeightChange,
}: {
  placement: AdPlacement;
  height: number;
  min: number;
  max: number;
  imageUrl?: string;
  onHeightChange: (next: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  // 원본 비율을 알아야 잘림 여부를 알려줄 수 있다.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  // 실제 띠는 화면 전체 폭이라, 소재 규격의 기준은 뷰포트 폭이다.
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const barRatio = viewportWidth / height;
  const naturalRatio = natural ? natural.w / natural.h : null;
  // object-cover라 비율이 다르면 넘치는 쪽이 잘린다.
  const cropSide =
    naturalRatio === null
      ? null
      : Math.abs(naturalRatio - barRatio) < 0.5
        ? null
        : naturalRatio > barRatio
          ? '좌우'
          : '위아래';

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    setDragging(true);

    const handleMove = (ev: PointerEvent) => {
      const next = Math.round(startHeight + (ev.clientY - startY));
      onHeightChange(Math.min(max, Math.max(min, next)));
    };
    const handleUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const isTop = placement === 'top';

  return (
    <div className="relative select-none">
      {/* 실제 배너와 동일하게, 띠 전체를 이미지가 채우고 라벨은 그 위에 얹는다. */}
      <div
        style={{
          height,
          background: isTop
            ? 'linear-gradient(90deg, rgba(124,108,240,.14), rgba(224,85,155,.12))'
            : 'rgba(13,12,24,.82)',
        }}
        className={`relative overflow-hidden ${
          isTop ? 'border-y border-white/10' : 'border-t border-white/[0.12]'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="배너 미리보기"
            onLoad={(e) =>
              setNatural({
                w: e.currentTarget.naturalWidth,
                h: e.currentTarget.naturalHeight,
              })
            }
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[11px] text-gray-600">
              활성화된 광고가 없습니다
            </span>
          </div>
        )}

        <span
          style={{ color: isTop ? '#c4b5fd' : '#93c5fd' }}
          className={`absolute top-1/2 -translate-y-1/2 z-10 px-1.5 py-0.5 rounded bg-black/45 backdrop-blur-sm text-[10px] font-bold tracking-[0.2em] ${
            isTop ? 'left-3' : 'left-4'
          }`}
        >
          {isTop ? 'SPONSORED' : 'AD'}
        </span>

        {!isTop && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-[26px] h-[26px] rounded-full bg-black/45 backdrop-blur-sm text-[#cfcfe0] text-[15px] leading-none flex items-center justify-center">
            ×
          </span>
        )}
      </div>

      {/* 아래 모서리 = 리사이즈 손잡이 */}
      <div
        onPointerDown={startResize}
        role="slider"
        aria-label="띠 높이 조절"
        aria-valuenow={height}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp')
            onHeightChange(Math.max(min, height - 1));
          if (e.key === 'ArrowDown')
            onHeightChange(Math.min(max, height + 1));
        }}
        className={`h-3 flex items-center justify-center cursor-ns-resize touch-none transition-colors ${
          dragging ? 'bg-blue-500/40' : 'bg-white/5 hover:bg-white/10'
        }`}
      >
        <div className="w-10 h-[3px] rounded-full bg-white/40" />
      </div>

      <div className="mt-2 space-y-1.5 text-[11px] text-gray-500">
        <div className="flex items-center justify-between gap-3">
          <span>아래 손잡이를 끌어 높이를 조절하세요 (↑↓ 키도 가능)</span>
          <span className="shrink-0 font-bold text-gray-300">
            띠 높이 {height}px
            <span className="text-gray-600 font-normal"> / 최대 {max}px</span>
          </span>
        </div>

        {/* 이미지가 띠 전체를 채우므로(cover) 소재는 화면 폭 기준으로 만들어야 한다. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/5 pt-1.5">
          <span>
            띠 크기{' '}
            <span className="text-gray-300 font-bold">
              화면 전체 폭 × {height}px
            </span>
            <span className="text-gray-600">
              {' '}
              (지금 이 브라우저 기준 {viewportWidth}px)
            </span>
          </span>
          {natural && (
            <span className="text-gray-600">
              원본 {natural.w}×{natural.h}
            </span>
          )}
        </div>

        <div className="text-gray-600">
          권장 소재{' '}
          <span className="text-gray-400 font-bold">
            가로 1920px 이상 × 세로 {height}px
          </span>{' '}
          (비율 약 {barRatio.toFixed(1)} : 1) — 이미지가 띠 전체를 채우므로, 비율이
          맞지 않으면 넘치는 쪽이 잘립니다.
        </div>

        {cropSide && (
          <div className="text-amber-400/80">
            지금 올라간 소재는 띠 비율과 달라 <b>{cropSide}</b>가 잘립니다. 가로
            1920 × 세로 {height} 비율에 맞춘 소재를 권장합니다.
          </div>
        )}
      </div>
    </div>
  );
}

interface AdEditorProps {
  initial?: Advertisement;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void;
}

function AdEditor({ initial, submitLabel, onSubmit, onDelete }: AdEditorProps) {
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl ?? '');
  const [altText, setAltText] = useState(initial?.altText ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.imageUrl ?? '');
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!initial && !file) {
      alert('광고 이미지를 첨부해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('linkUrl', linkUrl);
    formData.append('altText', altText);
    formData.append('isActive', String(isActive));
    if (file) formData.append('image', file);

    setSaving(true);
    try {
      await onSubmit(formData);
      setFile(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/50 backdrop-blur-sm p-5 border border-white/10 shadow-xl rounded-2xl"
    >
      <div className="flex flex-col lg:flex-row gap-5">
        {/* 이미지 */}
        <div className="flex flex-col gap-2 shrink-0">
          <label className={labelStyle}>배너 이미지</label>
          <div className="group relative w-full lg:w-[300px] h-[80px] bg-slate-950 border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors rounded-xl">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="배너"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium border border-white/20 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    이미지 변경
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-500">
                이미지 선택
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            띠 전체를 채웁니다. 가로 1920px 이상 권장
            <br />
            (JPG / PNG / WEBP, 최대 25MB)
          </p>
        </div>

        {/* 정보 */}
        <div className="flex-1 space-y-4">
          <div>
            <label className={labelStyle}>클릭 시 이동할 링크 (선택)</label>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className={inputStyle}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className={labelStyle}>대체 텍스트 (선택)</label>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className={inputStyle}
              placeholder="예: OO증권 대학생 이벤트"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <span className="text-sm text-gray-300">
              활성화 (활성 광고가 여러 개면 5초 간격으로 번갈아 노출)
            </span>
          </label>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="sm:w-40 cursor-pointer border border-red-500/40 text-red-300 py-3 rounded-xl font-bold text-sm hover:bg-red-500/10 hover:text-red-200 active:scale-[0.98] transition-all duration-300"
          >
            삭제
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminAdvertisement() {
  const [groups, setGroups] = useState<PlacementGroup[]>([]);
  const [selected, setSelected] = useState<AdPlacement>('top');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  // 띠 높이는 draft에서 조절하고 저장을 눌러야 서버에 반영된다.
  const [draftHeight, setDraftHeight] = useState<number | null>(null);
  const [savingHeight, setSavingHeight] = useState(false);

  const fetchGroups = async () => {
    try {
      const res = await api.getAllAdvertisements();
      setGroups(res.data);
      setDraftHeight(null);
    } catch (err) {
      console.error('광고 로딩 실패:', err);
      alert(`광고를 불러오지 못했습니다: ${errorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 탭을 옮기면 저장 안 한 높이 조절은 버린다.
  useEffect(() => {
    setDraftHeight(null);
    setAdding(false);
  }, [selected]);

  const meta = PLACEMENTS.find((p) => p.key === selected)!;
  const group = groups.find((g) => g.placement === selected);
  const height = draftHeight ?? group?.barHeight ?? meta.max;
  const previewAd = group?.ads.find((ad) => ad.isActive);

  const handleHeightSave = async () => {
    if (savingHeight || draftHeight === null) return;
    setSavingHeight(true);
    try {
      await api.updateAdPlacement(selected, draftHeight);
      await fetchGroups();
    } catch (err) {
      alert(`높이 저장 실패: ${errorMessage(err)}`);
    } finally {
      setSavingHeight(false);
    }
  };

  const handleCreate = async (formData: FormData) => {
    formData.append('placement', selected);
    try {
      await api.createAdvertisement(formData);
      setAdding(false);
      await fetchGroups();
    } catch (err) {
      alert(`등록 실패: ${errorMessage(err)}`);
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      await api.updateAdvertisement(id, formData);
      alert('저장되었습니다.');
      await fetchGroups();
    } catch (err) {
      alert(`수정 실패: ${errorMessage(err)}`);
    }
  };

  const handleDelete = async (ad: Advertisement) => {
    if (!confirm('이 광고를 삭제할까요?')) return;
    try {
      await api.deleteAdvertisement(ad.id);
      await fetchGroups();
    } catch (err) {
      alert(`삭제 실패: ${errorMessage(err)}`);
    }
  };

  if (loading) {
    return <div className="text-gray-400 px-2">불러오는 중...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-10">
      {/* 헤더 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          광고 배너 관리
        </h1>
        <p className="text-sm text-gray-300">
          메인 페이지에 노출되는 스폰서 배너를 위치별로 관리합니다.
        </p>
      </div>

      {/* 위치 탭 */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit border border-white/5 mx-2">
        {PLACEMENTS.map((p) => (
          <button
            key={p.key}
            onClick={() => setSelected(p.key)}
            className={`px-6 cursor-pointer py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              selected === p.key
                ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 px-2 break-keep">{meta.description}</p>

      {/* 띠 높이 조절 */}
      <div className="mx-2 bg-slate-800/50 backdrop-blur-sm p-5 border border-white/10 shadow-xl rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-200">띠 높이</h2>
          {draftHeight !== null && (
            <span className="text-[11px] text-cyan-300">
              저장하지 않은 변경이 있습니다
            </span>
          )}
        </div>

        <BarPreview
          placement={selected}
          height={height}
          min={meta.min}
          max={meta.max}
          imageUrl={previewAd?.imageUrl}
          onHeightChange={setDraftHeight}
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleHeightSave}
            disabled={draftHeight === null || savingHeight}
            className="flex-1 cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingHeight ? '저장 중...' : '높이 저장하기'}
          </button>
          <button
            type="button"
            onClick={() => setDraftHeight(null)}
            disabled={draftHeight === null}
            className="sm:w-40 cursor-pointer border border-white/20 text-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            되돌리기
          </button>
        </div>
      </div>

      {/* 광고 목록 */}
      <div className="space-y-4 px-2">
        <h2 className="text-sm font-bold text-gray-200 px-1">
          등록된 광고 {group ? `(${group.ads.length})` : ''}
        </h2>

        {group?.ads.map((ad, index) => (
          <div key={ad.id} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-bold text-gray-500 tracking-widest">
                #{index + 1}
              </span>
              {!ad.isActive && (
                <span className="text-[11px] text-gray-600">비활성</span>
              )}
            </div>
            <AdEditor
              initial={ad}
              submitLabel="변경사항 저장하기"
              onSubmit={(formData) => handleUpdate(ad.id, formData)}
              onDelete={() => handleDelete(ad)}
            />
          </div>
        ))}

        {group && group.ads.length === 0 && (
          <div className="text-gray-500 text-sm py-6 text-center border border-dashed border-white/10 rounded-2xl">
            등록된 광고가 없습니다.
          </div>
        )}

        {adding ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-500 tracking-widest">
                새 광고
              </span>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                취소
              </button>
            </div>
            <AdEditor submitLabel="광고 등록하기" onSubmit={handleCreate} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full cursor-pointer border border-dashed border-white/20 text-gray-300 py-4 rounded-2xl font-bold hover:border-blue-500/50 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            + {meta.label}에 광고 추가
          </button>
        )}
      </div>
    </div>
  );
}
