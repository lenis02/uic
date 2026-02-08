// src/components/AdminGreeting.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

interface GreetingData {
  role: string;
  name: string;
  fullRole: string;
  greeting: string;
  content: string;
  quote: string;
  imageUrl?: string;
}

export default function AdminGreeting() {
  const [selectedRole, setSelectedRole] = useState<'회장' | '부회장'>('회장');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const [form, setForm] = useState<GreetingData>({
    role: '회장',
    name: '',
    fullRole: '',
    greeting: '',
    content: '',
    quote: '',
  });

  // 1. 데이터 불러오기
  const fetchGreeting = async (role: string) => {
    try {
      const res = await api.getGreetingByRole(role);
      setForm({
        role: res.data.role || role,
        name: res.data.name || '',
        fullRole: res.data.fullRole || '',
        greeting: res.data.greeting || '',
        content: res.data.content || '',
        quote: res.data.quote || '',
      });
      setPreview(res.data.imageUrl ? `${res.data.imageUrl}` : '');
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
    }
  };

  useEffect(() => {
    fetchGreeting(selectedRole);
  }, [selectedRole]);

  // 2. 이미지 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 3. 저장(수정) 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('role', form.role);
    formData.append('name', form.name);
    formData.append('fullRole', form.fullRole);
    formData.append('greeting', form.greeting);
    formData.append('content', form.content);
    formData.append('quote', form.quote);

    if (file) {
      formData.append('image', file);
    }

    try {
      await api.updateGreeting(form.role, formData);
      alert(`${form.role} 인사말이 성공적으로 수정되었습니다!`);
      fetchGreeting(form.role);
      setFile(null);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message;
      alert(
        `수정 실패: ${Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg}`
      );
    }
  };

  // 공통 스타일 정의
  const labelStyle = 'block text-sm font-medium text-gray-300 mb-2';
  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10  px-4 py-3 text-gray-200 placeholder-gray-300 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-10 custom-scrollbar scrollbar-hide lg:scrollbar-default">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          인사말 관리
        </h1>
        <p className="text-sm text-gray-300">
          회장 및 부회장의 인사말과 프로필 이미지를 관리합니다.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit border border-white/5 mx-2">
        {(['회장', '부회장'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRole(r)}
            className={`px-6 cursor-pointer py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              selectedRole === r
                ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {r === '회장' ? '회장' : '부회장'}
          </button>
        ))}
      </div>

      {/* 입력 폼 컨테이너: 모바일에서 화면이 작아지면 내부 스크롤 발생 */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽: 이미지 영역 - 너비를 고정하여 크기 축소 */}
          <div className="flex flex-col items-center lg:items-start gap-3 flex-shrink-0">
            <label className={labelStyle}>프로필 이미지</label>
            <div className="group relative w-[200px] aspect-[4/5] bg-slate-950 border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors rounded-xl shadow-2xl">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
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
            <p className="text-[11px] text-gray-500 text-center lg:text-left leading-tight w-[200px]">
              * 4:5 비율 최적화
              <br />
              (클릭하여 파일 선택)
            </p>
          </div>

          {/* 오른쪽: 텍스트 정보 영역 - 나머지 공간 모두 사용 */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>성함</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputStyle}
                  placeholder="예: 홍길동"
                />
              </div>
              <div>
                <label className={labelStyle}>상세 직함</label>
                <input
                  value={form.fullRole}
                  onChange={(e) =>
                    setForm({ ...form, fullRole: e.target.value })
                  }
                  className={inputStyle}
                  placeholder="예: 제 19대 회장"
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>한 줄 인사</label>
              <input
                value={form.greeting}
                onChange={(e) => setForm({ ...form, greeting: e.target.value })}
                className={inputStyle}
                placeholder="예: 안녕하세요, UIC입니다."
              />
            </div>

            <div>
              <label className={labelStyle}>멋있는 말 (Quote)</label>
              <input
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                className={inputStyle}
                placeholder="예: 미래를 향한 첫 걸음"
              />
            </div>

            <div>
              <label className={labelStyle}>인사말 본문</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                className={`${inputStyle} resize-none leading-relaxed text-sm`}
                placeholder="상세 인사말을 입력하세요."
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 영역 */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white py-3.5 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.005] active:scale-[0.98] transition-all duration-300"
          >
            변경사항 저장하기
          </button>
        </div>
      </form>
    </div>
  );
}
