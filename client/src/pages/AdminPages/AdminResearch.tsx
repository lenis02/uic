import React, { useState, useEffect } from 'react';
import { api, type ResearchPayload } from '../../api/api';
import { uploadToCloudinary } from '../../api/cloudinary';
import UploadOrLinkField, {
  emptyUploadChoice,
  type UploadChoice,
} from '../../components/admin/UploadOrLinkField';

// ✅ 선택 가능한 카테고리 ('전체' 제외)
const CATEGORIES = ['대상', '최우수상', '우수상', '장려상', '수상작', '기타'];

const errorMessage = (err: unknown) => {
  if (err instanceof Error && !('response' in err)) return err.message;
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : (msg ?? '내용을 확인해주세요.');
};

export default function AdminResearch() {
  const [researchList, setResearchList] = useState<any[]>([]);

  // 🔹 연도 필터 상태 ('ALL'이면 전체 보기)
  const [selectedYear, setSelectedYear] = useState<string | 'ALL'>('ALL');

  // 수정 모드인지 확인하기 위한 상태 (null이면 생성 모드, ID가 있으면 수정 모드)
  const [editingId, setEditingId] = useState<number | null>(null);

  // 🔹 [변경] category 상태 추가 (기본값: 기타)
  const [form, setForm] = useState({
    title: '',
    category: '기타',
    year: '',
  });

  const [upload, setUpload] = useState<UploadChoice>(emptyUploadChoice);
  const [saving, setSaving] = useState(false);

  const fetchResearch = async () => {
    try {
      const res = await api.getResearch();
      // 최신순 정렬
      // const sorted = res.data.sort((a: any, b: any) => b.id - a.id);
      // setResearchList(sorted);
      setResearchList(res.data);
    } catch (err) {
      console.error('리스트 로딩 실패', err);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  // 🔹 등록된 연도 목록 (중복 제거 후 최신순)
  const years = Array.from(
    new Set(researchList.map((r) => r.year).filter(Boolean))
  ).sort((a, b) => Number(b) - Number(a));

  // 🔹 선택된 연도로 필터링
  const filteredResearch =
    selectedYear === 'ALL'
      ? researchList
      : researchList.filter((r) => String(r.year) === String(selectedYear));

  // [수정 모드 진입 함수]
  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category || '기타',
      year: item.year,
    });
    setUpload(emptyUploadChoice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // [취소 함수]
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', category: '기타', year: '' });
    setUpload(emptyUploadChoice);
  };

  // 업로드 모드면 Cloudinary에 직접 올린 URL을, 링크 모드면 입력한 링크를 쓴다.
  // 둘 다 비어 있으면(수정 모드) 기존 pdfUrl을 그대로 둔다.
  const resolvePdfUrl = async () => {
    if (upload.mode === 'link') return upload.url.trim() || undefined;
    if (!upload.file) return undefined;

    // 예: report_1700000000000.pdf 형식으로 완벽하게 영어/숫자화
    const extension = upload.file.name.split('.').pop();
    const safeFile = new File(
      [upload.file],
      `report_${Date.now()}.${extension}`,
      { type: upload.file.type }
    );
    return await uploadToCloudinary(safeFile, 'research');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const pdfUrl = await resolvePdfUrl();

      if (!editingId && (!pdfUrl || !form.title)) {
        alert('제목과 PDF 파일(또는 드라이브 링크)은 필수입니다.');
        return;
      }

      const payload: Partial<ResearchPayload> = {
        title: form.title,
        category: form.category,
        year: form.year,
        ...(pdfUrl ? { pdfUrl } : {}),
      };

      if (editingId) {
        await api.updateResearch(editingId, payload);
        alert('리서치가 수정되었습니다!');
      } else {
        await api.createResearch(payload as ResearchPayload);
        alert('리서치가 등록되었습니다!');
      }
      handleCancelEdit();
      fetchResearch();
    } catch (err) {
      console.error(err);
      alert(`작업 실패! ${errorMessage(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          리서치 관리
        </h1>
        <p className="text-sm text-gray-300">
          리서치 자료를 업로드하고 관리합니다.
        </p>
      </div>

      {/* 1. 입력 폼 */}
      <div
        className={`p-6 border shadow-xl rounded-2xl mx-2 transition-colors duration-300 ${
          editingId
            ? 'bg-blue-900/20 border-blue-500/30'
            : 'bg-slate-800/50 border-white/10'
        }`}
      >
        <div className="flex justify-between items-center mb-4 ml-1">
          <h2 className="text-lg font-bold text-white/80">
            {editingId ? '리서치 수정하기' : '새 리서치 등록'}
          </h2>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="cursor-pointer text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
            >
              수정 취소
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 제목 */}
            <div className="sm:col-span-2 md:col-span-2">
              <label className="text-xs text-gray-400 ml-1 mb-1 block">
                제목(필수)
              </label>
              <input
                placeholder="리서치 제목"
                className={inputStyle}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* 🔹 카테고리 선택 (Select Box) */}
            <div className="md:col-span-1">
              <label className="text-xs text-gray-400 ml-1 mb-1 block">
                카테고리
              </label>
              <select
                className={inputStyle}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-900 text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 작성자 */}
            <div className="md:col-span-1">
              <label className="text-xs text-gray-400 ml-1 mb-1 block">
                작성 연도(필수)
              </label>
              <input
                placeholder="예 : 2026"
                className={inputStyle}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-xl border border-dashed border-white/10">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-blue-400">
                <span className="bg-blue-500/10 p-1 rounded">📄</span>
                PDF 파일 {editingId ? '(변경 시에만 선택)' : '(필수)'}
              </label>
              <UploadOrLinkField
                accept=".pdf"
                value={upload}
                onChange={setUpload}
                disabled={saving}
              />
            </div>
          </div>

          <button
            disabled={saving}
            className={`cursor-pointer w-full h-12 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              editingId
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 hover:shadow-lg'
            }`}
          >
            {saving ? '업로드 중...' : editingId ? '수정 완료' : '리서치 업로드 시작'}
          </button>
        </form>
      </div>

      {/* 🟠 연도 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scroll px-1">
        <button
          onClick={() => setSelectedYear('ALL')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            selectedYear === 'ALL'
              ? 'bg-white text-black shadow'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          전체 보기
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              selectedYear === year
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* 2. 리스트 */}
      <div className="px-2">
        <h3 className="text-lg font-bold text-white/80 mb-4 ml-1">
          업로드된 리서치{' '}
          <span className="text-sm font-normal text-gray-500">
            ({filteredResearch.length})
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResearch.map((r) => (
            <div
              key={r.id}
              className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-lg transition-all flex flex-col p-4"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-blue-300 border border-blue-500/30">
                  {r.category || '미분류'}
                </span>
                <span className="text-xs text-gray-500">{r.year}</span>
              </div>
              <h3 className="font-bold text-gray-100 mb-4 flex-1 leading-snug">
                {r.title}
              </h3>

              <div className="mt-auto pt-3 border-t border-white/5 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(r)}
                    className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                  >
                    ✏️ 수정
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm('정말 삭제하시겠습니까?')) {
                        await api.deleteResearch(r.id);
                        fetchResearch();
                      }
                    }}
                    className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                  >
                    🗑️ 삭제
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
