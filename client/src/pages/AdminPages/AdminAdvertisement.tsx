import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

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
  isActive: boolean;
  sortOrder: number;
}

// 서버(AD_SIZE_LIMITS)와 같은 값.
const SIZE_LIMITS: Record<
  AdType,
  { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number }
> = {
  anchored: { minWidth: 200, maxWidth: 1200, minHeight: 60, maxHeight: 300 },
  floating: { minWidth: 100, maxWidth: 200, minHeight: 200, maxHeight: 600 },
};

const TYPES: { key: AdType; label: string; description: string }[] = [
  {
    key: 'anchored',
    label: '위치 고정형',
    description:
      '메인 페이지의 특정 섹션에 박혀 페이지와 함께 스크롤됩니다. 아래 미리보기에서 넣을 자리를 직접 고르세요.',
  },
  {
    key: 'floating',
    label: '추적형',
    description:
      '화면 좌우 여백에 고정되어 스크롤 내내 따라옵니다. 여백이 없는 좁은 화면에서는 자동으로 숨겨집니다.',
  },
];

const SECTIONS: { key: AdSection; label: string }[] = [
  { key: 'home', label: '히어로 (대한민국 금융의 미래)' },
  { key: 'vision', label: 'Vision' },
  { key: 'network', label: 'UIC Network' },
  { key: 'partner', label: 'UIC Partner' },
];

// 미리보기 축척. 실제 px * SCALE = 미리보기 px
const SCALE = 1 / 3;

const labelStyle = 'block text-sm font-medium text-gray-300 mb-2';
const inputStyle =
  'w-full bg-slate-950/50 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-300 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

const errorMessage = (err: unknown) => {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join('\n') : (msg ?? '알 수 없는 오류');
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** 선택된 자리에 놓이는 광고 사각형. 우하단 모서리를 끌어 크기를 조절한다. */
function SizeBox({
  type,
  width,
  height,
  imageUrl,
  onResize,
  className,
  style,
}: {
  type: AdType;
  width: number;
  height: number;
  imageUrl?: string;
  onResize: (size: { width: number; height: number }) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [dragging, setDragging] = useState(false);
  const limit = SIZE_LIMITS[type];

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = width;
    const startH = height;
    setDragging(true);

    const handleMove = (ev: PointerEvent) => {
      // 미리보기는 1/3 축척이라 끈 거리를 실제 px로 되돌린다.
      onResize({
        width: clamp(
          Math.round(startW + (ev.clientX - startX) / SCALE),
          limit.minWidth,
          limit.maxWidth,
        ),
        height: clamp(
          Math.round(startH + (ev.clientY - startY) / SCALE),
          limit.minHeight,
          limit.maxHeight,
        ),
      });
    };
    const handleUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const stepResize = (dw: number, dh: number) =>
    onResize({
      width: clamp(width + dw, limit.minWidth, limit.maxWidth),
      height: clamp(height + dh, limit.minHeight, limit.maxHeight),
    });

  return (
    <div
      style={{ width: width * SCALE, height: height * SCALE, ...style }}
      className={`absolute ${className ?? ''}`}
    >
      <div
        className={`w-full h-full overflow-hidden rounded border bg-blue-500/15 ${
          dragging ? 'border-blue-400' : 'border-blue-500/70'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="광고 미리보기"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[9px] text-blue-200/70">
            광고
          </div>
        )}
      </div>

      {/* 우하단 리사이즈 손잡이 */}
      <div
        onPointerDown={startResize}
        role="slider"
        aria-label="광고 크기 조절"
        aria-valuenow={width}
        aria-valuemin={limit.minWidth}
        aria-valuemax={limit.maxWidth}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 1;
          if (e.key === 'ArrowRight') stepResize(step, 0);
          if (e.key === 'ArrowLeft') stepResize(-step, 0);
          if (e.key === 'ArrowDown') stepResize(0, step);
          if (e.key === 'ArrowUp') stepResize(0, -step);
        }}
        className={`absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 rounded-sm border border-white/70 cursor-nwse-resize touch-none ${
          dragging ? 'bg-blue-400' : 'bg-blue-500'
        }`}
      />
    </div>
  );
}

/** 위치 고정형: 메인 페이지 축소도에서 섹션의 위/아래 자리를 고른다. */
function AnchoredSlotPicker({
  section,
  edge,
  width,
  height,
  imageUrl,
  onSelect,
  onResize,
}: {
  section: AdSection | null;
  edge: AdEdge | null;
  width: number;
  height: number;
  imageUrl?: string;
  onSelect: (section: AdSection, edge: AdEdge) => void;
  onResize: (size: { width: number; height: number }) => void;
}) {
  return (
    <div className="w-full max-w-[620px] mx-auto bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
      <div className="h-7 border-b border-white/10 flex items-center px-3 text-[9px] tracking-[0.2em] text-gray-600">
        NAVBAR
      </div>

      {SECTIONS.map((s) => (
        <div
          key={s.key}
          className="relative h-[124px] border-b border-white/5 last:border-b-0"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 z-0 text-[10px] text-gray-600 pointer-events-none">
            {s.label}
          </span>

          {(['top', 'bottom'] as AdEdge[]).map((e) => {
            const selected = section === s.key && edge === e;
            return (
              <button
                key={e}
                type="button"
                onClick={() => onSelect(s.key, e)}
                title={e === 'top' ? '섹션 위쪽에 넣기' : '섹션 아래쪽에 넣기'}
                className={`absolute left-0 right-0 h-[62px] cursor-pointer transition-colors ${
                  e === 'top' ? 'top-0' : 'bottom-0'
                } ${selected ? 'bg-blue-500/10' : 'hover:bg-white/[0.05]'}`}
              />
            );
          })}

          {section === s.key && edge && (
            <SizeBox
              type="anchored"
              width={width}
              height={height}
              imageUrl={imageUrl}
              onResize={onResize}
              className="left-1/2 -translate-x-1/2 z-10"
              style={edge === 'top' ? { top: 8 } : { bottom: 8 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/** 추적형: 화면 좌우 여백 중 한쪽을 고른다. */
function FloatingSlotPicker({
  side,
  width,
  height,
  imageUrl,
  onSelect,
  onResize,
}: {
  side: AdSide | null;
  width: number;
  height: number;
  imageUrl?: string;
  onSelect: (side: AdSide) => void;
  onResize: (size: { width: number; height: number }) => void;
}) {
  return (
    <div className="relative w-full max-w-[620px] mx-auto h-[260px] bg-[#050505] border border-white/10 rounded-xl overflow-hidden">
      <div className="absolute left-[100px] right-[100px] top-0 bottom-0 border-x border-dashed border-white/10 flex items-center justify-center">
        <span className="text-[10px] text-gray-600">본문 영역</span>
      </div>

      {(['left', 'right'] as AdSide[]).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className={`absolute top-0 bottom-0 w-[100px] cursor-pointer transition-colors ${
            s === 'left' ? 'left-0' : 'right-0'
          } ${side === s ? 'bg-blue-500/10' : 'bg-white/[0.02] hover:bg-white/[0.06]'}`}
        >
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 whitespace-nowrap">
            {s === 'left' ? '왼쪽 여백' : '오른쪽 여백'}
          </span>
        </button>
      ))}

      {side && (
        <SizeBox
          type="floating"
          width={width}
          height={height}
          imageUrl={imageUrl}
          onResize={onResize}
          className="top-1/2 -translate-y-1/2 z-10"
          style={side === 'left' ? { left: 12 } : { right: 12 }}
        />
      )}
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
  const [type, setType] = useState<AdType>(initial?.type ?? 'anchored');
  const [section, setSection] = useState<AdSection | null>(
    initial?.section ?? null,
  );
  const [edge, setEdge] = useState<AdEdge | null>(initial?.edge ?? null);
  const [side, setSide] = useState<AdSide | null>(initial?.side ?? null);
  const [width, setWidth] = useState(initial?.width ?? 728);
  const [height, setHeight] = useState(initial?.height ?? 90);
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl ?? '');
  const [altText, setAltText] = useState(initial?.altText ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.imageUrl ?? '');
  const [saving, setSaving] = useState(false);

  const typeMeta = TYPES.find((t) => t.key === type)!;
  const limit = SIZE_LIMITS[type];

  // 타입을 바꾸면 크기 규격이 달라서 범위 안으로 당겨준다.
  const changeType = (next: AdType) => {
    setType(next);
    const nextLimit = SIZE_LIMITS[next];
    setWidth((w) => clamp(w, nextLimit.minWidth, nextLimit.maxWidth));
    setHeight((h) => clamp(h, nextLimit.minHeight, nextLimit.maxHeight));
  };

  const handleResize = (size: { width: number; height: number }) => {
    setWidth(size.width);
    setHeight(size.height);
  };

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
    if (type === 'anchored' && (!section || !edge)) {
      alert('미리보기에서 광고를 넣을 자리를 골라주세요.');
      return;
    }
    if (type === 'floating' && !side) {
      alert('좌우 여백 중 한쪽을 골라주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('section', type === 'anchored' ? (section ?? '') : '');
    formData.append('edge', type === 'anchored' ? (edge ?? '') : '');
    formData.append('side', type === 'floating' ? (side ?? '') : '');
    formData.append('width', String(width));
    formData.append('height', String(height));
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
      className="bg-slate-800/50 backdrop-blur-sm p-5 border border-white/10 shadow-xl rounded-2xl space-y-5"
    >
      {/* 1. 타입 */}
      <div>
        <label className={labelStyle}>광고 타입</label>
        <div className="flex gap-2 p-1 bg-slate-950/50 rounded-xl w-fit border border-white/5">
          {TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => changeType(t.key)}
              className={`px-5 cursor-pointer py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                type === t.key
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-gray-500 break-keep">
          {typeMeta.description}
        </p>
      </div>

      {/* 2. 자리 + 크기 GUI */}
      <div>
        <label className={labelStyle}>
          {type === 'anchored' ? '넣을 자리' : '여백 선택'} 및 크기
        </label>

        {type === 'anchored' ? (
          <AnchoredSlotPicker
            section={section}
            edge={edge}
            width={width}
            height={height}
            imageUrl={preview || undefined}
            onSelect={(s, e) => {
              setSection(s);
              setEdge(e);
            }}
            onResize={handleResize}
          />
        ) : (
          <FloatingSlotPicker
            side={side}
            width={width}
            height={height}
            imageUrl={preview || undefined}
            onSelect={setSide}
            onResize={handleResize}
          />
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
          <span>
            {type === 'anchored'
              ? '섹션의 위/아래 영역을 클릭해 자리를 정하고, 파란 사각형 우하단을 끌어 크기를 조절하세요.'
              : '왼쪽/오른쪽 여백을 클릭하고, 파란 사각형 우하단을 끌어 크기를 조절하세요.'}
          </span>
          <span className="shrink-0 font-bold text-gray-300">
            {width} × {height}px
            <span className="text-gray-600 font-normal">
              {' '}
              (가로 {limit.minWidth}~{limit.maxWidth} / 세로 {limit.minHeight}~
              {limit.maxHeight})
            </span>
          </span>
        </div>
      </div>

      {/* 3. 소재 및 정보 */}
      <div className="flex flex-col lg:flex-row gap-5 border-t border-white/10 pt-5">
        <div className="flex flex-col gap-2 shrink-0">
          <label className={labelStyle}>배너 이미지</label>
          <div className="group relative w-full lg:w-[240px] h-[110px] bg-slate-950 border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors rounded-xl">
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
            소재는 위에서 정한 {width}×{height}px 틀에 맞춰 채워집니다.
            <br />
            (JPG / PNG / WEBP, 최대 25MB)
          </p>
        </div>

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
              활성화 (같은 자리에 활성 광고가 여러 개면 5초 간격으로 순환)
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
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

const slotLabel = (ad: Advertisement) => {
  if (ad.type === 'anchored') {
    const name = SECTIONS.find((s) => s.key === ad.section)?.label ?? ad.section;
    return `위치 고정형 · ${name} ${ad.edge === 'top' ? '위쪽' : '아래쪽'}`;
  }
  return `추적형 · ${ad.side === 'left' ? '왼쪽' : '오른쪽'} 여백`;
};

export default function AdminAdvertisement() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchAds = async () => {
    try {
      const res = await api.getAllAdvertisements();
      setAds(res.data);
    } catch (err) {
      console.error('광고 로딩 실패:', err);
      alert(`광고를 불러오지 못했습니다: ${errorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      await api.createAdvertisement(formData);
      setAdding(false);
      await fetchAds();
    } catch (err) {
      alert(`등록 실패: ${errorMessage(err)}`);
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      await api.updateAdvertisement(id, formData);
      alert('저장되었습니다.');
      await fetchAds();
    } catch (err) {
      alert(`수정 실패: ${errorMessage(err)}`);
    }
  };

  const handleDelete = async (ad: Advertisement) => {
    if (!confirm('이 광고를 삭제할까요?')) return;
    try {
      await api.deleteAdvertisement(ad.id);
      await fetchAds();
    } catch (err) {
      alert(`삭제 실패: ${errorMessage(err)}`);
    }
  };

  if (loading) {
    return <div className="text-gray-400 px-2">불러오는 중...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-10">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          광고 배너 관리
        </h1>
        <p className="text-sm text-gray-300">
          메인 페이지에 노출되는 스폰서 배너를 관리합니다.
        </p>
        <p className="text-xs text-gray-500 mt-1 break-keep">
          타입을 고른 뒤 미리보기에서 넣을 자리를 클릭하고, 사각형을 끌어 크기를
          맞추세요.
        </p>
      </div>

      <div className="space-y-5 px-2">
        {ads.map((ad, index) => (
          <div key={ad.id} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-bold text-gray-500 tracking-widest">
                #{index + 1}
              </span>
              <span className="text-xs text-gray-400">{slotLabel(ad)}</span>
              <span className="text-xs text-gray-600">
                {ad.width}×{ad.height}px
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

        {ads.length === 0 && (
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
            + 새 광고 추가
          </button>
        )}
      </div>
    </div>
  );
}
