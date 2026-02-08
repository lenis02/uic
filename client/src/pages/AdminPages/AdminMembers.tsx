// src/pages/AdminMembers.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { compressImage } from '../../utils/imageCompression';

// 1. 공통 데이터 상수화 (중복 제거)
const POSITIONS = [
  '회장',
  '부회장',
  '기획', // 백엔드 자동생성 값과 통일
  '대외협력',
  '마케팅',
  '재무',
  '인사',
  '부원', // 일반 회원용 추가
];

interface Member {
  id: number;
  name: string;
  position: string;
  generation: number;
  workplace?: string;
  email?: string;
  imageUrl?: string;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGen, setSelectedGen] = useState<number | 'ALL'>('ALL');

  // --- 상태 관리 ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    position: 'Member',
    workplace: '',
    email: '',
    generation: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  // --- 데이터 로딩 ---
  const fetchMembers = async () => {
    try {
      const res = await api.getMembers();
      const data = res.data;
      setMembers(data);

      if (data.length > 0 && form.generation === 0) {
        const maxGen = Math.max(...data.map((m: Member) => m.generation));
        setForm((prev) => ({ ...prev, generation: maxGen }));
      }
    } catch (err) {
      console.error('로딩 실패:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const generations = Array.from(
    new Set(members.map((m) => m.generation))
  ).sort((a, b) => b - a);

  const filteredMembers =
    selectedGen === 'ALL'
      ? members
      : members.filter((m) => m.generation === selectedGen);

  // --- 핸들러 ---
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean
  ) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    try {
      // 1. 압축 진행
      console.log(
        '압축 시작 전:',
        (selected.size / 1024 / 1024).toFixed(2),
        'MB'
      );
      const compressedBlob = await compressImage(selected); // 변수명 변경 (Blob일 수 있음)
      console.log(
        '압축 완료 후:',
        (compressedBlob.size / 1024 / 1024).toFixed(2),
        'MB'
      );

      // ⚠️ [중요 수정] 압축된 Blob을 '원본 파일 이름'을 가진 File 객체로 다시 만듦
      // 이걸 안 하면 서버에서 파일명이 'blob'으로 찍힐 수 있음
      const finalFile = new File([compressedBlob], selected.name, {
        type: selected.type,
        lastModified: Date.now(),
      }); // 2. 프리뷰용 URL 생성 (압축된 파일 기준)

      const url = URL.createObjectURL(finalFile); // 3. 상태 업데이트

      if (isEdit) {
        setEditFile(finalFile); // File 객체 저장
        setEditPreview(url);
      } else {
        setFile(finalFile); // File 객체 저장
        setPreview(url);
      }
    } catch (error) {
      console.error('이미지 처리 중 에러:', error);
      alert('이미지 압축에 실패했습니다. 원본을 사용합니다.');

      // 실패 시 비상 대책: 원본 사용
      const url = URL.createObjectURL(selected);
      if (isEdit) {
        setEditFile(selected);
        setEditPreview(url);
      } else {
        setFile(selected);
        setPreview(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert('이름은 필수입니다.');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('generation', String(form.generation));
    formData.append('workplace', form.workplace);
    formData.append('email', form.email);
    if (file) formData.append('image', file);

    try {
      await api.createMember(formData);
      alert('등록 완료!');
      setForm((prev) => ({
        name: '',
        position: 'Member',
        workplace: '',
        email: '',
        generation: prev.generation,
      }));
      setFile(null);
      setPreview('');
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('등록 실패!');
    }
  };

  const handleEditClick = (member: Member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
    setEditFile(null);
    setEditPreview(
      member.imageUrl ? `${import.meta.env.VITE_API_URL}${member.imageUrl}` : ''
    );
  };

  const handleUpdateSave = async () => {
    if (!editingId) return;
    const formData = new FormData();
    if (editForm.name) formData.append('name', editForm.name);
    if (editForm.position) formData.append('position', editForm.position);
    if (editForm.generation)
      formData.append('generation', String(editForm.generation));
    if (editForm.workplace !== undefined)
      formData.append('workplace', editForm.workplace);
    if (editForm.email !== undefined) formData.append('email', editForm.email);
    if (editFile) formData.append('image', editFile);

    try {
      await api.updateMember(editingId, formData);
      alert('수정되었습니다.');
      setEditingId(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('수정 실패!');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await api.deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // --- 스타일 ---
  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all';
  const smallInputStyle =
    'w-full bg-slate-950/80 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-20 p-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-white">멤버 관리</h1>
        <p className="text-sm text-gray-400">
          새 멤버를 등록하거나 정보를 수정하세요.
        </p>
      </div>

      {/* 🟢 1. 등록 폼 (레이아웃 개선: 옹졸함 탈피!) */}
      <div className="bg-slate-800/50 backdrop-blur-md p-6 border border-white/10 rounded-2xl shadow-xl">
        <h2 className="text-lg font-bold text-white mb-6">새 멤버 등록</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* 사진 업로드 (왼쪽 고정) */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="relative w-40 h-48 bg-slate-950 rounded-xl border border-dashed border-white/20 overflow-hidden hover:border-blue-500 transition-colors group shadow-inner">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                  <span className="text-3xl">📷</span>
                  <span className="text-xs font-medium">사진 업로드</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, false)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            <p className="text-[10px] text-gray-500">권장 비율 3:4</p>
          </div>

          {/* 입력 필드 (오른쪽 확장) */}
          <div className="flex-1 flex flex-col justify-between gap-5">
            {/* 윗줄: 이름, 기수, 직책 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">
                  이름 <span className="text-red-400">*</span>
                </label>
                <input
                  placeholder="홍길동"
                  className={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">
                  기수 <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="예: 19"
                  className={inputStyle}
                  value={form.generation}
                  onChange={(e) =>
                    setForm({ ...form, generation: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">직책</label>
                {/* ✨ 반복 제거: map 사용 */}
                <select
                  className={inputStyle}
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 아랫줄: 직장, 이메일 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">
                  직장 / 소속
                </label>
                <input
                  placeholder="예: Samsung Electronics"
                  className={inputStyle}
                  value={form.workplace}
                  onChange={(e) =>
                    setForm({ ...form, workplace: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">이메일</label>
                <input
                  placeholder="example@uic.com"
                  className={inputStyle}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 mt-2">
              + 멤버 등록하기
            </button>
          </div>
        </form>
      </div>

      {/* 🟠 2. 기수 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scroll px-1">
        <button
          onClick={() => setSelectedGen('ALL')}
          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            selectedGen === 'ALL'
              ? 'bg-white text-black shadow'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          전체 보기
        </button>
        {generations.map((gen) => (
          <button
            key={gen}
            onClick={() => setSelectedGen(gen)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              selectedGen === gen
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {gen}기
          </button>
        ))}
      </div>

      {/* 🟡 3. 리스트 (카드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`relative p-4 rounded-xl transition-all ${
              editingId === member.id
                ? 'bg-slate-800 ring-2 ring-blue-500 shadow-xl'
                : 'bg-slate-900/50 border border-white/5 hover:bg-slate-800/80 hover:-translate-y-1'
            }`}
          >
            {editingId === member.id ? (
              // ✏️ [수정 모드]
              <div className="flex flex-col gap-2 animate-fade-in">
                {/* 이미지 수정 */}
                <div className="flex justify-center mb-2">
                  <div className="relative w-20 h-24 bg-slate-950 rounded border border-dashed border-white/30 overflow-hidden group">
                    <img
                      src={editPreview || '/no-image.png'}
                      className="w-full h-full object-cover opacity-50"
                      alt="edit"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      사진 변경
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>
                </div>

                {/* 정보 수정 Inputs */}
                <div className="flex gap-2">
                  <input
                    className={`${smallInputStyle} flex-1`}
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
                  className={smallInputStyle}
                  value={editForm.position}
                  onChange={(e) =>
                    setEditForm({ ...editForm, position: e.target.value })
                  }
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>

                <input
                  className={smallInputStyle}
                  value={editForm.workplace || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, workplace: e.target.value })
                  }
                  placeholder="직장/소속"
                />
                <input
                  className={smallInputStyle}
                  value={editForm.email || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="이메일"
                />

                <div className="flex justify-end gap-2 mt-2 border-t border-white/10 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 bg-slate-700 rounded text-xs text-gray-300 hover:bg-slate-600 transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdateSave}
                    className="px-3 py-1.5 bg-blue-600 rounded text-xs text-white font-bold hover:bg-blue-500 transition"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              // 👁️ [보기 모드]
              <div className="flex gap-4 items-start h-full relative">
                {' '}
                {/* relative 추가 */}
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-white/10">
                  {member.imageUrl ? (
                    <img
                      src={
                        member.imageUrl?.startsWith('http')
                          ? member.imageUrl
                          : `${import.meta.env.VITE_API_URL}${member.imageUrl}`
                      }
                      className="w-full h-full object-cover"
                      alt={member.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                      No Img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center pr-6">
                  {' '}
                  {/* 버튼 공간 확보 위해 pr-6 */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-white text-lg truncate">
                      {member.name}
                    </span>
                    <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-cyan-400 border border-white/5">
                      {member.generation}기
                    </span>
                  </div>
                  <div className="text-xs text-blue-400 font-medium mb-1">
                    {member.position}
                  </div>
                  {member.workplace && (
                    <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                      🏢 {member.workplace}
                    </div>
                  )}
                  {member.email && (
                    <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                      📧 {member.email}
                    </div>
                  )}
                </div>
                {/* 👇 [수정/삭제 버튼] 항상 보이게 수정함! */}
                <div className="flex flex-col gap-1 absolute top-0 right-0">
                  <button
                    onClick={() => handleEditClick(member)}
                    className="cursor-pointer w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
                    title="수정"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="cursor-pointer w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
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
