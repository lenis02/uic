// src/pages/AdminMembers.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

interface Member {
  id: number;
  name: string;
  position: string;
  school: string;
  generation: number;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGen, setSelectedGen] = useState<number | 'ALL'>('ALL');

  // --- 수정 모드 상태 ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});

  // --- 등록 폼 상태 ---
  const [form, setForm] = useState({
    name: '',
    position: 'Member',
    school: '',
    generation: 20,
  });

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

  // --- 핸들러: 등록 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.school) return alert('이름과 학교는 필수입니다.');
    try {
      await api.createMember({ ...form, generation: Number(form.generation) });
      alert('등록 완료!');
      setForm({ ...form, name: '', school: '' });
      fetchMembers();
    } catch (err) {
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
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdateSave = async () => {
    if (!editingId) return;
    try {
      await api.updateMember(editingId, editForm);
      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.id === editingId ? ({ ...m, ...editForm } as Member) : m
        )
      );
      alert('수정되었습니다.');
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
    'w-full bg-slate-950/50 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:ring-1 focus:ring-blue-500 outline-none';

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
        >
          <input
            placeholder="이름"
            className={inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="학교"
            className={inputStyle}
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
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
          <button className="lg:col-span-2 w-full h-full min-h-[48px] bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
            + 멤버 등록하기
          </button>
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
                <input
                  className={smallInputStyle}
                  value={editForm.school}
                  onChange={(e) =>
                    setEditForm({ ...editForm, school: e.target.value })
                  }
                  placeholder="학교"
                />
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
              <div className="flex justify-between items-start h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white tracking-tight">
                        {member.name}
                      </span>
                      <span className="text-[10px] font-bold bg-white/10 text-cyan-300 px-2 py-0.5 rounded-full border border-white/5">
                        {member.generation}기
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm font-light mb-4">
                      {member.school}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider ${
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
                  {/* 수정 버튼 */}
                  <button
                    onClick={() => handleEditClick(member)}
                    className="text-white hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
                    title="수정"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-white hover:text-red-700 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="삭제"
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
