import React, { useEffect, useRef, useState } from 'react';

export type LogoCategory = 'university' | 'club';

export const CATEGORY_LABEL: Record<LogoCategory, string> = {
  university: '대학',
  club: '연합동아리',
};

export interface LogoItem {
  id: number;
  name: string;
  logoUrl: string | null;
  darkBg?: boolean;
  category?: LogoCategory;
}

interface Props {
  title: string;
  description: string;
  /** '참여 대학' / '협력사' 처럼 안내 문구에 들어갈 단위 */
  itemLabel: string;
  /** 밝은 로고용 어두운 배경 옵션 노출 여부 (참여 대학만 사용) */
  showDarkBg?: boolean;
  /** 대학 / 연합동아리 분류 선택 노출 여부 (참여 대학만 사용) */
  showCategory?: boolean;
  fetchItems: () => Promise<{ data: LogoItem[] }>;
  createItem: (data: FormData) => Promise<unknown>;
  updateItem: (id: number, data: FormData) => Promise<unknown>;
  deleteItem: (id: number) => Promise<unknown>;
}

const inputStyle =
  'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

export default function AdminLogoBoard({
  title,
  description,
  itemLabel,
  showDarkBg = false,
  showCategory = false,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
}: Props) {
  const [items, setItems] = useState<LogoItem[]>([]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<LogoCategory>('university');
  const [darkBg, setDarkBg] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<LogoCategory>('university');
  const [editDarkBg, setEditDarkBg] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await fetchItems();
      setItems(res.data);
    } catch {
      console.error(`${itemLabel} 목록 불러오기 실패`);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('university');
    setDarkBg(false);
    setFile(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false,
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (isEdit) {
      setEditFile(f);
      setEditPreview(url);
    } else {
      setFile(f);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const fd = new FormData();
    fd.append('name', name.trim());
    if (file) fd.append('logo', file);
    if (showCategory) fd.append('category', category);
    if (showDarkBg) fd.append('darkBg', String(darkBg));

    try {
      await createItem(fd);
      resetForm();
      load();
    } catch {
      alert('등록 실패');
    }
  };

  const startEdit = (item: LogoItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category ?? 'university');
    setEditDarkBg(Boolean(item.darkBg));
    setEditFile(null);
    setEditPreview(item.logoUrl ?? '');
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const fd = new FormData();
    fd.append('name', editName.trim());
    if (editFile) fd.append('logo', editFile);
    if (showCategory) fd.append('category', editCategory);
    if (showDarkBg) fd.append('darkBg', String(editDarkBg));

    try {
      await updateItem(id, fd);
      setEditingId(null);
      load();
    } catch {
      alert('수정 실패');
    }
  };

  const handleDelete = async (item: LogoItem) => {
    if (!window.confirm(`'${item.name}'을(를) 삭제하시겠습니까?`)) return;
    try {
      await deleteItem(item.id);
      load();
    } catch {
      alert('삭제 실패');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">{title}</h1>
        <p className="text-sm text-gray-300">{description}</p>
      </div>

      {/* 등록 폼 */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2">
        <h3 className="text-lg font-bold text-white/80 mb-4 ml-1">새 {itemLabel} 등록</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors min-h-[140px]"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} className="max-h-32 rounded-lg object-contain" />
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">로고 이미지 선택 (JPG / PNG / WebP)</p>
                <p className="text-gray-500 text-xs">선택하지 않으면 이름만 표시됩니다 · 최대 25MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={(e) => handleFileChange(e)} />
          </div>

          <input placeholder={`${itemLabel} 이름`} className={inputStyle}
            value={name} onChange={(e) => setName(e.target.value)} />

          {showCategory && (
            <select className={`${inputStyle} cursor-pointer`} value={category}
              onChange={(e) => setCategory(e.target.value as LogoCategory)}>
              <option className="bg-slate-900" value="university">대학</option>
              <option className="bg-slate-900" value="club">연합동아리</option>
            </select>
          )}

          {showDarkBg && (
            <label className="flex items-center gap-2 text-sm text-gray-300 pl-1 cursor-pointer w-fit">
              <input type="checkbox" checked={darkBg} onChange={(e) => setDarkBg(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer" />
              로고가 밝은 색이라 어두운 배경이 필요함
            </label>
          )}

          <div className="flex justify-end">
            <button type="submit"
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
              등록
            </button>
          </div>
        </form>
      </div>

      {/* 목록 */}
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-lg font-bold text-white/80">등록된 {itemLabel} 목록</h3>
          <span className="text-xs text-gray-300">총 {items.length}개</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 text-gray-500">
            등록된 {itemLabel}이(가) 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item) => (
              <div key={item.id}
                className={`group bg-slate-900/50 border rounded-xl transition-all duration-300 ${
                  editingId === item.id
                    ? 'col-span-full p-4 border-blue-500/30'
                    : 'p-3 border-white/5 hover:bg-slate-800/60 hover:border-blue-500/30 flex flex-col gap-2'
                }`}>

                {editingId === item.id ? (
                  /* ── 수정 모드 ── */
                  <div className="space-y-3">
                    <div
                      className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors min-h-[120px]"
                      onClick={() => editFileRef.current?.click()}
                    >
                      {editPreview
                        ? <img src={editPreview} className="max-h-28 rounded-lg object-contain" />
                        : <p className="text-gray-500 text-sm">클릭하여 로고 등록</p>}
                      <p className="text-gray-500 text-xs">클릭하면 교체됩니다 · 최대 25MB</p>
                      <input ref={editFileRef} type="file" accept="image/jpeg,image/png,image/webp"
                        className="hidden" onChange={(e) => handleFileChange(e, true)} />
                    </div>
                    <input className={inputStyle} value={editName}
                      onChange={(e) => setEditName(e.target.value)} />
                    {showCategory && (
                      <select className={`${inputStyle} cursor-pointer`} value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as LogoCategory)}>
                        <option className="bg-slate-900" value="university">대학</option>
                        <option className="bg-slate-900" value="club">연합동아리</option>
                      </select>
                    )}
                    {showDarkBg && (
                      <label className="flex items-center gap-2 text-sm text-gray-300 pl-1 cursor-pointer w-fit">
                        <input type="checkbox" checked={editDarkBg}
                          onChange={(e) => setEditDarkBg(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer" />
                        로고가 밝은 색이라 어두운 배경이 필요함
                      </label>
                    )}
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm">
                        취소
                      </button>
                      <button onClick={() => handleUpdate(item.id)}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer">
                        저장
                      </button>
                    </div>
                  </div>

                ) : (
                  /* ── 보기 모드 ── */
                  <>
                    <div className={`w-full aspect-[4/3] rounded-lg flex items-center justify-center p-2 ${
                      item.darkBg ? 'bg-slate-700' : 'bg-white'
                    }`}>
                      {item.logoUrl ? (
                        <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-500 text-center break-keep leading-tight px-1">
                          {item.name}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-200 text-xs font-medium text-center break-keep leading-tight line-clamp-2">
                      {item.name}
                    </p>

                    {showCategory && item.category && (
                      <span className="text-[10px] text-gray-500 text-center">
                        {CATEGORY_LABEL[item.category]}
                      </span>
                    )}

                    <div className="flex gap-1 mt-auto">
                      <button onClick={() => startEdit(item)}
                        className="flex-1 py-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500/20 transition-colors text-xs font-medium opacity-70 group-hover:opacity-100 cursor-pointer">
                        수정
                      </button>
                      <button onClick={() => handleDelete(item)}
                        className="flex-1 py-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-colors text-xs font-medium opacity-70 group-hover:opacity-100 cursor-pointer">
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
