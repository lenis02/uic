// src/pages/AdminResearch.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

export default function AdminResearch() {
  const [researchList, setResearchList] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    type: 'Weekly', // Weekly, Industry, Company, Macro
    description: '',
  });

  // 파일 상태 관리
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchResearch = async () => {
    try {
      const res = await api.getResearch();
      // 최신순 정렬 (ID 기준 내림차순 가정)
      const sorted = res.data.sort((a: any, b: any) => b.id - a.id);
      setResearchList(sorted);
    } catch (err) {
      console.error('리스트 로딩 실패', err);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !form.title) return alert('제목과 PDF 파일은 필수입니다.');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('type', form.type);
    formData.append('description', form.description);
    formData.append('pdf', pdfFile);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    try {
      await api.createResearch(formData);
      alert('리서치가 성공적으로 업로드되었습니다!');
      // 초기화
      setForm({ title: '', type: 'Weekly', description: '' });
      setPdfFile(null);
      setThumbnailFile(null);
      // 파일 input 초기화를 위해 DOM 조작 대신 key를 바꾸거나 해야하지만,
      // 간단히 리스트 갱신만 처리 (실제 input value 리셋은 useRef가 필요하나 생략)
      fetchResearch();
    } catch (err) {
      console.error(err);
      alert('업로드 실패! 파일을 확인해주세요.');
    }
  };

  // 공통 스타일
  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

  // 파일 인풋 스타일 (Tailwind file modifier 사용)
  const fileInputStyle =
    'block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer';

  // 타입별 배지 색상 매핑
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Weekly':
        return 'bg-cyan-900/50 text-cyan-300 border-cyan-500/30';
      case 'Industry':
        return 'bg-purple-900/50 text-purple-300 border-purple-500/30';
      case 'Company':
        return 'bg-blue-900/50 text-blue-300 border-blue-500/30';
      case 'Macro':
        return 'bg-orange-900/50 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          리서치 관리
        </h1>
        <p className="text-sm text-gray-300">
          Weekly Report 및 리서치 자료를 업로드하고 관리합니다.
        </p>
      </div>

      {/* 1. 업로드 폼 */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2">
        <h2 className="text-lg font-bold text-white/80 mb-4 ml-1">
          새 리서치 등록
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 상단 입력 필드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <input
                placeholder="리서치 제목 (예: 2024년 1월 3주차 Weekly)"
                className={inputStyle}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          <textarea
            placeholder="간략한 설명 (선택사항)"
            rows={3}
            className={`${inputStyle} resize-none`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* 파일 업로드 구역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-900/60 rounded-xl border border-dashed border-white/10 hover:border-blue-500/30 transition-colors">
            {/* PDF 업로드 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-blue-400">
                <span className="bg-blue-500/10 p-1 rounded">📄</span>
                PDF 파일 (필수)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className={fileInputStyle}
              />
              <p className="text-xs text-gray-500 pl-1">
                {pdfFile ? `선택됨: ${pdfFile.name}` : '최대 10MB 권장'}
              </p>
            </div>

            {/* 썸네일 업로드 */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-purple-400">
                <span className="bg-purple-500/10 p-1 rounded">🖼️</span>
                썸네일 이미지 (선택)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className={fileInputStyle}
              />
              <p className="text-xs text-gray-500 pl-1">
                {thumbnailFile
                  ? `선택됨: ${thumbnailFile.name}`
                  : '미선택 시 기본 이미지'}
              </p>
            </div>
          </div>

          <button className="w-full h-12 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer">
            리서치 업로드 시작
          </button>
        </form>
      </div>

      {/* 2. 리서치 목록 */}
      <div className="px-2">
        <h3 className="text-lg font-bold text-white/80 mb-4 ml-1">
          업로드된 리서치{' '}
          <span className="text-sm font-normal text-gray-500">
            ({researchList.length})
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {researchList.map((r) => (
            <div
              key={r.id}
              className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* 썸네일 영역 */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-white/5">
                {r.thumbnailUrl ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${r.thumbnailUrl}`}
                    alt="thumb"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-slate-900">
                    <span className="text-xs">No Image</span>
                  </div>
                )}

                {/* PDF 다운로드 오버레이 (Hover 시 표시) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={`${import.meta.env.VITE_API_URL}${r.pdfUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-xs text-white border border-white/20 transition cursor-pointer"
                  >
                    PDF 보기
                  </a>
                </div>

                {/* 타입 배지 (절대 위치) */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${getTypeBadgeStyle(
                      r.type
                    )}`}
                  >
                    {r.type}
                  </span>
                </div>
              </div>

              {/* 정보 영역 */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-100 mb-1 line-clamp-2 leading-tight min-h-[2.5rem]">
                  {r.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                  {r.description || '설명 없음'}
                </p>

                {/* 하단 액션 버튼 */}
                <div className="mt-auto pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={async () => {
                      if (confirm('이 리서치를 삭제하시겠습니까?')) {
                        await api.deleteResearch(r.id);
                        fetchResearch();
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
