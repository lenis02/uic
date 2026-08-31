import React, { useEffect, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { api } from '../../api/api';

interface Activity {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
}

// 공통 스타일 (다른 관리자 화면과 동일)
const labelStyle = 'block text-sm font-medium text-gray-300 mb-2';
const inputStyle =
  'w-full bg-slate-950/50 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-300 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

const resolveImageUrl = (url: string | null) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
};

const errorMessage = (err: unknown) => {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join('\n') : (msg ?? '알 수 없는 오류');
};

// 가로 2 x 세로 3 점으로 된 드래그 손잡이.
const GripIcon = () => (
  <svg viewBox="0 0 10 16" className="w-2.5 h-4" fill="currentColor" aria-hidden>
    <circle cx="2" cy="3" r="1.4" />
    <circle cx="8" cy="3" r="1.4" />
    <circle cx="2" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="2" cy="13" r="1.4" />
    <circle cx="8" cy="13" r="1.4" />
  </svg>
);

// 손잡이를 잡았을 때만 끌리도록 dragListener를 끄고 dragControls로 시작시킨다.
function ReorderRow({ item }: { item: Activity }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 bg-slate-950/60 border border-white/10 rounded-xl px-3 py-3 select-none"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        aria-label={`${item.title} 순서 변경`}
        className="shrink-0 p-1 text-gray-500 hover:text-gray-200 cursor-grab active:cursor-grabbing touch-none transition-colors"
      >
        <GripIcon />
      </button>
      <span className="text-sm text-gray-200 font-medium truncate">
        {item.title}
      </span>
    </Reorder.Item>
  );
}

interface EditorProps {
  initial?: Activity;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onDelete?: () => void;
}

// 등록 폼과 수정 폼이 완전히 같은 모양이라 하나로 쓴다.
function ActivityEditor({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: EditorProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(resolveImageUrl(initial?.imageUrl ?? null));
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
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
      className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 이미지 */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <label className={labelStyle}>활동 이미지</label>
          <div className="group relative w-full lg:w-[260px] aspect-[3/2] bg-slate-950 border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors rounded-xl shadow-2xl">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={title || '활동 이미지'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium border border-white/20 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    이미지 변경
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  className="w-8 h-8 mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-gray-400">이미지 선택</span>
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
            * 3:2 비율 최적화
            <br />
            (JPG / PNG / WEBP, 최대 4MB)
          </p>
        </div>

        {/* 텍스트 */}
        <div className="flex-1 space-y-4">
          <div>
            <label className={labelStyle}>활동 제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputStyle}
              placeholder="예: 정기총회"
              required
            />
          </div>

          <div>
            <label className={labelStyle}>설명 (한 줄에 한 항목)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`${inputStyle} resize-none leading-relaxed text-sm`}
              placeholder={'월 1회 정기적으로 총회 진행\n학술 교류 및 친목 도모'}
              required
            />
            <p className="mt-2 text-[11px] text-gray-500 leading-relaxed">
              줄바꿈 한 번이 불릿 하나입니다. 일부만 굵게 하려면{' '}
              <code className="text-gray-400">
                &lt;span class="font-black"&gt;강조&lt;/span&gt;
              </code>{' '}
              처럼 감싸세요.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white py-3 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.005] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {saving ? '저장 중...' : submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="sm:w-40 cursor-pointer border border-red-500/40 text-red-300 py-3 rounded-xl font-bold text-base hover:bg-red-500/10 hover:text-red-200 active:scale-[0.98] transition-all duration-300"
          >
            삭제
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminActivity() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  // 순서 조정은 draft에서만 하고, 저장을 눌러야 서버에 반영된다.
  const [reordering, setReordering] = useState(false);
  const [draft, setDraft] = useState<Activity[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.getActivities();
      setItems(res.data);
    } catch (err) {
      console.error('활동 로딩 실패:', err);
      alert(`활동 목록을 불러오지 못했습니다: ${errorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      await api.createActivity(formData);
      setAdding(false);
      await fetchItems();
    } catch (err) {
      alert(`등록 실패: ${errorMessage(err)}`);
    }
  };

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      await api.updateActivity(id, formData);
      alert('저장되었습니다.');
      await fetchItems();
    } catch (err) {
      alert(`수정 실패: ${errorMessage(err)}`);
    }
  };

  const handleDelete = async (item: Activity) => {
    if (!confirm(`'${item.title}' 활동을 삭제할까요?`)) return;
    try {
      await api.deleteActivity(item.id);
      await fetchItems();
    } catch (err) {
      alert(`삭제 실패: ${errorMessage(err)}`);
    }
  };

  const openReorder = () => {
    setDraft(items);
    setReordering(true);
  };

  const handleReorderSave = async () => {
    if (savingOrder) return;
    setSavingOrder(true);
    try {
      await api.reorderActivities(draft.map((item) => item.id));
      setReordering(false);
      await fetchItems();
    } catch (err) {
      alert(`순서 저장 실패: ${errorMessage(err)}`);
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-10">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
            활동 관리
          </h1>
          <p className="text-sm text-gray-300">
            Activity 페이지에 노출되는 활동 섹션을 추가·수정·삭제합니다.
          </p>
          <p className="text-xs text-gray-500 mt-1 break-keep">
            노출 순서가 작은 활동이 위로 옵니다. 첫 번째 활동은 이미지(좌) /
            설명(우)로 배치되고, 그 다음부터 좌우가 번갈아 바뀝니다.
          </p>
        </div>

        {!loading && items.length > 1 && (
          <button
            type="button"
            onClick={reordering ? () => setReordering(false) : openReorder}
            className="shrink-0 cursor-pointer whitespace-nowrap px-4 py-2 rounded-xl border border-white/20 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300"
          >
            {reordering ? '닫기' : '배치 순서 조정'}
          </button>
        )}
      </div>

      {/* 배치 순서 조정 패널 */}
      {reordering && (
        <div className="mx-2 bg-slate-800/50 backdrop-blur-sm p-5 border border-white/10 shadow-xl rounded-2xl space-y-4">
          <p className="text-xs text-gray-500">
            왼쪽 손잡이를 잡고 위아래로 끌어 순서를 바꾸세요.
          </p>

          <Reorder.Group
            axis="y"
            values={draft}
            onReorder={setDraft}
            className="space-y-2"
          >
            {draft.map((item) => (
              <ReorderRow key={item.id} item={item} />
            ))}
          </Reorder.Group>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleReorderSave}
              disabled={savingOrder}
              className="flex-1 cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingOrder ? '저장 중...' : '순서 저장하기'}
            </button>
            <button
              type="button"
              onClick={() => setReordering(false)}
              className="sm:w-40 cursor-pointer border border-white/20 text-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-white/5 hover:text-white active:scale-[0.98] transition-all duration-300"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 px-2">불러오는 중...</div>
      ) : (
        <div className="space-y-6 px-2">
          {items.map((item, index) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  #{index + 1}
                </span>
                <span className="text-xs text-gray-500">
                  {index % 2 === 0 ? '이미지(좌) / 설명(우)' : '설명(좌) / 이미지(우)'}
                </span>
              </div>
              <ActivityEditor
                initial={item}
                submitLabel="변경사항 저장하기"
                onSubmit={(formData) => handleUpdate(item.id, formData)}
                onDelete={() => handleDelete(item)}
              />
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-gray-500 text-sm py-6 text-center border border-dashed border-white/10 rounded-2xl">
              등록된 활동이 없습니다.
            </div>
          )}

          {/* 새 활동 추가 */}
          {adding ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-500 tracking-widest">
                  새 활동
                </span>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors"
                >
                  취소
                </button>
              </div>
              <ActivityEditor
                submitLabel="활동 등록하기"
                onSubmit={handleCreate}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="w-full cursor-pointer border border-dashed border-white/20 text-gray-300 py-4 rounded-2xl font-bold hover:border-blue-500/50 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              + 새 활동 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
}
