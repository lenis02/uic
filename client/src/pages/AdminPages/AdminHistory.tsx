// src/pages/AdminHistory.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

interface HistoryItem {
  id: number;
  year: string;
  title: string;
  date: string;
}

export default function AdminHistory() {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [form, setForm] = useState({ year: '', title: '', date: '' });

  // 1. 연혁 목록 가져오기
  const fetchHistories = async () => {
    try {
      const res = await api.getHistory();
      // (선택사항) 최신 연도가 위로 오게 정렬하려면 아래 주석 해제
      // const sorted = res.data.sort((a: any, b: any) => Number(b.year) - Number(a.year));
      setHistories(res.data);
    } catch (err) {
      console.error('목록 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  // 2. 연혁 등록하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year || !form.title) {
      alert('연도와 내용을 입력해주세요.');
      return;
    }

    try {
      await api.createHistory(form);
      alert('성공적으로 등록되었습니다.');
      setForm({ year: '', title: '', date: '' });
      fetchHistories();
    } catch (err) {
      console.error(err);
      alert('등록 실패: 서버 오류가 발생했습니다.');
    }
  };

  // 3. 연혁 삭제하기
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까? 복구할 수 없습니다.')) return;
    try {
      await api.deleteHistory(id);
      fetchHistories();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  // 공통 스타일 (AdminGreeting과 통일)
  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-10 h-screen overflow-y-auto">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          연혁 관리
        </h1>
        <p className="text-sm text-gray-300">
          UIC의 발자취를 기록하고 관리합니다. (최신순 정렬 권장)
        </p>
      </div>

      {/* 1. 등록 폼 영역 */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2">
        <h3 className="text-lg font-bold text-white/80 mb-4 ml-1">
          새 연혁 등록
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {/* 연도 입력 (2칸) */}
          <div className="md:col-span-2">
            <input
              placeholder="연도 (2024)"
              className={inputStyle}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>

          {/* 날짜 입력 (2칸) */}
          <div className="md:col-span-2">
            <input
              placeholder="날짜 (08.22)"
              className={inputStyle}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          {/* 내용 입력 (6칸) */}
          <div className="md:col-span-6">
            <input
              placeholder="내용을 입력하세요 (예: 제 1회 해커톤 개최)"
              className={inputStyle}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* 추가 버튼 (2칸) */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full cursor-pointer min-h-[48px] bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              추가
            </button>
          </div>
        </form>
      </div>

      {/* 2. 연혁 리스트 영역 */}
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-lg font-bold text-white/80">등록된 연혁 목록</h3>
          <span className="text-xs text-gray-300">총 {histories.length}개</span>
        </div>

        {histories.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 text-gray-500">
            등록된 연혁이 없습니다.
          </div>
        ) : (
          <div className="grid gap-3">
            {histories.map((h) => (
              <div
                key={h.id}
                className="group flex flex-col md:flex-row md:items-center justify-between bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 hover:border-blue-500/30 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* 왼쪽: 정보 영역 */}
                <div className="flex flex-1 items-start md:items-center gap-4 md:gap-8">
                  {/* 연도 & 날짜 배지 */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="text-xl font-black text-blue-400 tracking-tight">
                      {h.year}
                    </span>
                    {h.date && (
                      <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                        {h.date}
                      </span>
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="text-gray-200 font-medium break-all">
                    {h.title}
                  </div>
                </div>

                {/* 오른쪽: 삭제 버튼 (모바일에서는 상단 우측, PC에서는 우측 끝) */}
                <div className="mt-4 md:mt-0 flex justify-end">
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-colors text-sm font-medium opacity-70 group-hover:opacity-100"
                  >
                    <svg
                      className="w-4 h-4"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
