// src/pages/AdminMembers.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

interface Member {
  id: number;
  name: string;
  position: string;
  generation: number;
  imageUrl?: string; // 이미지 URL 필드 추가
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGen, setSelectedGen] = useState<number | 'ALL'>('ALL');

  // --- 수정 모드 상태 ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [editFile, setEditFile] = useState<File | null>(null); // 수정용 파일 상태
  const [editPreview, setEditPreview] = useState<string>(''); // 수정용 미리보기

  // --- 등록 폼 상태 ---
  const [form, setForm] = useState({
    name: '',
    position: 'Member',
    generation: 21,
  });
  const [file, setFile] = useState<File | null>(null); // 등록용 파일
  const [preview, setPreview] = useState<string>(''); // 등록용 미리보기

  const fetchMembers = async () => {
    try {
      const res = await api.getMembers();
      setMembers(res.data);
    } catch (err) {
      console.error('로딩 실패:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 기수 목록 추출 & 정렬
  const generations = Array.from(
    new Set(members.map((m) => m.generation))
  ).sort((a, b) => b - a);

  // 필터링
  const filteredMembers =
    selectedGen === 'ALL'
      ? members
      : members.filter((m) => m.generation === selectedGen);

  // --- 파일 선택 핸들러 (등록용) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // --- 파일 선택 핸들러 (수정용) ---
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setEditFile(selected);
      setEditPreview(URL.createObjectURL(selected));
    }
  };

  // --- 핸들러: 등록 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert('이름은 필수입니다.');

    // FormData 생성
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('generation', String(form.generation));
    if (file) {
      formData.append('image', file); // 백엔드 @UploadedFile('image')
    }

    try {
      await api.createMember(formData); // createMember가 FormData를 받도록 수정 필요
      alert('등록 완료!');

      // 초기화
      setForm({ name: '', position: 'Member', generation: 20 });
      setFile(null);
      setPreview('');

      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('등록 실패!');
    }
  };

  // --- 핸들러: 삭제 ---
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await api.deleteMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // --- 핸들러: 수정 ---
  const handleEditClick = (member: Member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
    setEditFile(null); // 파일 초기화
    // 기존 이미지가 있으면 미리보기로 설정
    setEditPreview(
      member.imageUrl ? `${import.meta.env.VITE_API_URL}${member.imageUrl}` : ''
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditFile(null);
    setEditPreview('');
  };

  const handleUpdateSave = async () => {
    if (!editingId) return;

    const formData = new FormData();
    if (editForm.name) formData.append('name', editForm.name);
    if (editForm.position) formData.append('position', editForm.position);
    if (editForm.generation)
      formData.append('generation', String(editForm.generation));
    if (editFile) {
      formData.append('image', editFile);
    }

    try {
      await api.updateMember(editingId, formData); // updateMember가 FormData 받도록 수정 필요
      alert('수정되었습니다.');
      fetchMembers(); // 이미지가 바뀌면 URL이 달라질 수 있으므로 전체 다시 로드 권장
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('수정 실패! 백엔드 로그를 확인하세요.');
    }
  };

  // 공통 스타일
  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

  const smallInputStyle =
    'w-full bg-slate-950/50 text-center border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:ring-1 focus:ring-blue-500 outline-none';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-20">
      {/* 헤더 섹션 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          멤버 관리
        </h1>
        <p className="text-sm text-gray-300">
          UIC 멤버들의 정보를 등록하고 관리합니다.
        </p>
      </div>

      {/* --- 1. 등록 폼 --- */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2">
        <h2 className="text-lg font-bold text-white/80 mb-4 ml-1">
          새 멤버 등록
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* 이미지 업로드 영역 (왼쪽) */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="relative w-32 h-40 bg-slate-950 rounded-xl border border-dashed border-white/20 overflow-hidden group hover:border-blue-500/50 transition-colors">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1">
                  <span className="text-2xl">📷</span>
                  <span className="text-[10px]">사진 추가</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 텍스트 입력 영역 (오른쪽) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="이름"
              className={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              className={`${inputStyle} appearance-none cursor-pointer`}
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            >
              <option value="Member">일반 회원</option>
              <option value="President">회장</option>
              <option value="Vice President">부회장</option>
              <option value="Planning Head">기획</option>
              <option value="External Relations Head">대외협력</option>
              <option value="Marketing Head">마케팅</option>
              <option value="Finance Head">재무</option>
              <option value="HR Head">인사</option>
            </select>
            <input
              type="number"
              placeholder="기수"
              className={inputStyle}
              value={form.generation}
              onChange={(e) =>
                setForm({ ...form, generation: Number(e.target.value) })
              }
            />
            <button className="lg:col-span-4 w-full h-12 mt-2 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer">
              + 멤버 등록하기
            </button>
          </div>
        </form>
      </div>

      {/* --- 2. 기수 필터 --- */}
      <div className="flex items-center gap-4 px-2 overflow-x-auto pb-2 custom-scroll">
        <span className="font-bold text-gray-300 whitespace-nowrap">
          기수 필터:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedGen('ALL')}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedGen === 'ALL'
                ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-white/20 shadow-md'
                : 'bg-slate-800 text-gray-400 border border-transparent hover:bg-slate-700 hover:text-white'
            }`}
          >
            전체
          </button>
          {generations.map((gen) => (
            <button
              key={gen}
              onClick={() => setSelectedGen(gen)}
              className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGen === gen
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md shadow-blue-900/30'
                  : 'bg-slate-800 text-gray-400 border border-transparent hover:bg-slate-700 hover:text-white'
              }`}
            >
              {gen}기
            </button>
          ))}
        </div>
      </div>

      {/* --- 3. 멤버 카드 리스트 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`relative p-5 rounded-2xl transition-all duration-300 ${
              editingId === member.id
                ? 'bg-slate-800/80 border border-blue-500/50 shadow-lg shadow-blue-900/10 ring-1 ring-blue-500/20'
                : 'bg-slate-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-slate-800/50 hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            {/* A. 수정 모드일 때 */}
            {editingId === member.id ? (
              <div className="flex flex-col gap-3 animate-fade-in">
                {/* 수정 모드 - 이미지 변경 영역 */}
                <div className="flex justify-center mb-2">
                  <div className="relative w-20 h-24 bg-slate-950 rounded-lg overflow-hidden border border-dashed border-white/30 group cursor-pointer hover:border-blue-500">
                    {editPreview ? (
                      <img
                        src={editPreview}
                        alt="edit-preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No Img
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white">변경</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    className={`${smallInputStyle} min-w-[80px]flex-1`}
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="이름"
                  />
                  <input
                    type="number"
                    className={`${smallInputStyle} w-16 text-center`}
                    value={editForm.generation}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        generation: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <select
                  className={`${smallInputStyle} appearance-none cursor-pointer`}
                  value={editForm.position}
                  onChange={(e) =>
                    setEditForm({ ...editForm, position: e.target.value })
                  }
                >
                  <option value="Member">일반 회원</option>
                  <option value="President">회장</option>
                  <option value="Vice President">부회장</option>
                  <option value="Planning Head">기획</option>
                  <option value="External Relations Head">대외협력</option>
                  <option value="Marketing Head">마케팅</option>
                  <option value="Finance Head">재무</option>
                  <option value="HR Head">인사</option>
                </select>

                <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-white/10">
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs bg-slate-700 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-slate-600 transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdateSave}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition cursor-pointer"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              /* B. 일반 보기 모드일 때 */
              <div className="flex justify-between items-start h-full gap-3">
                {/* 썸네일 (작게 표시) */}
                <div className="w-12 h-14 bg-slate-950 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  {member.imageUrl ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${member.imageUrl}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-gray-600 text-xs">
                      No Img
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between h-full flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white tracking-tight">
                        {member.name}
                      </span>
                      <span className="text-[10px] font-bold bg-white/10 text-cyan-300 px-2 py-0.5 rounded-full border border-white/5">
                        {member.generation}기
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider truncate ${
                        member.position.includes('Head') ||
                        member.position.includes('President')
                          ? 'text-blue-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {member.position}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(member)}
                    className="text-white hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                    title="수정"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-white hover:text-red-700 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
