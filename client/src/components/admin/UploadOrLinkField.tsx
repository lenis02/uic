import React, { useRef, useState } from 'react';
import { MAX_UPLOAD_BYTES, formatBytes } from '../../api/cloudinary';

// 파일을 직접 올릴지, 외부(드라이브 등) 링크로 대신할지.
export type UploadChoice =
  | { mode: 'file'; file: File | null }
  | { mode: 'link'; url: string };

export const emptyUploadChoice: UploadChoice = { mode: 'file', file: null };

interface Props {
  // '.pdf' 처럼 <input type="file"> 의 accept 와 같은 형식.
  accept: string;
  value: UploadChoice;
  onChange: (next: UploadChoice) => void;
  disabled?: boolean;
}

const acceptedExtensions = (accept: string) =>
  accept
    .split(',')
    .map((ext) => ext.trim().toLowerCase())
    .filter(Boolean);

const hasAcceptedExtension = (fileName: string, accept: string) =>
  acceptedExtensions(accept).some((ext) => fileName.toLowerCase().endsWith(ext));

const tabStyle = (active: boolean) =>
  `px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
    active
      ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
  }`;

export default function UploadOrLinkField({
  accept,
  value,
  onChange,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // 파일이 10MB를 넘으면 Cloudinary 무료 플랜으로 올릴 수 없으므로
  // 관리자가 다시 헤매지 않도록 링크 탭으로 바로 넘겨준다.
  const acceptFile = (file: File) => {
    if (!hasAcceptedExtension(file.name, accept)) {
      setNotice(`${accept} 형식만 올릴 수 있습니다.`);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setNotice(
        `"${file.name}"은(는) ${formatBytes(file.size)}로 직접 업로드 한도 ${formatBytes(
          MAX_UPLOAD_BYTES
        )}를 넘습니다. 드라이브에 올린 뒤 공유 링크를 붙여넣어 주세요.`
      );
      onChange({ mode: 'link', url: '' });
      return;
    }
    setNotice(null);
    onChange({ mode: 'file', file });
  };

  const switchMode = (mode: UploadChoice['mode']) => {
    if (disabled || value.mode === mode) return;
    setNotice(null);
    onChange(mode === 'file' ? { mode: 'file', file: null } : { mode: 'link', url: '' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) acceptFile(dropped);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl w-fit border border-white/5">
        <button
          type="button"
          onClick={() => switchMode('file')}
          className={tabStyle(value.mode === 'file')}
        >
          파일 업로드
        </button>
        <button
          type="button"
          onClick={() => switchMode('link')}
          className={tabStyle(value.mode === 'link')}
        >
          드라이브 링크
        </button>
      </div>

      {value.mode === 'file' ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`rounded-xl border border-dashed p-6 text-center transition-colors ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          } ${
            dragging
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-white/15 bg-slate-950/50 hover:border-white/30'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            disabled={disabled}
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) acceptFile(picked);
              // 같은 파일을 다시 골라도 change가 뜨도록 비워둔다.
              e.target.value = '';
            }}
          />
          {value.file ? (
            <p className="text-sm text-cyan-300 break-all">
              {value.file.name}{' '}
              <span className="text-gray-500">
                ({formatBytes(value.file.size)})
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              파일을 끌어다 놓거나 클릭해서 선택하세요
            </p>
          )}
          <p className="mt-1 text-[11px] text-gray-500">
            {accept} · 최대 {formatBytes(MAX_UPLOAD_BYTES)}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={value.url}
            disabled={disabled}
            onChange={(e) => onChange({ mode: 'link', url: e.target.value })}
            placeholder="https://drive.google.com/file/d/..."
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"
          />
          <p className="text-[11px] text-gray-500">
            드라이브 링크는 &lsquo;링크가 있는 모든 사용자&rsquo;로 공개해야
            방문자가 열 수 있습니다.
          </p>
        </div>
      )}

      {notice && <p className="text-[11px] text-amber-300">{notice}</p>}
    </div>
  );
}
