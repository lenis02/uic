// src/pages/AdminMembers.tsx
import React, { useEffect, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop'; // 📦 추가
import { api } from '../../api/api';
import { compressImage } from '../../utils/imageCompression';
import getCroppedImg from '../../utils/imageCrop'; // 📦 추가

// --- 타입 정의 ---
const POSITIONS = [
  '회장',
  '부회장',
  '기획',
  '대외협력',
  '마케팅',
  '재무',
  '인사',
  '부원',
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

// 📦 크롭 영역 타입
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGen, setSelectedGen] = useState<number | 'ALL'>('ALL');

  // --- 상태 관리: 수정 및 등록 폼 ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string>('');

  // 🗑️ 이미지가 삭제되었는지 확인하는 플래그 (수정 모드용)
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    position: 'Member',
    workplace: '',
    email: '',
    generation: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  // --- 상태 관리: 크롭퍼(Cropper) ---
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImg, setCropperImg] = useState<string | null>(null); // 크롭할 원본 이미지 URL
  const [isEditModeForCrop, setIsEditModeForCrop] = useState(false); // 현재 크롭이 수정모드인지 등록모드인지 구분

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

  // --- 1️⃣ 파일 선택 핸들러 (바로 저장하지 않고 크롭퍼 열기) ---
  const onSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropperImg(reader.result as string); // 크롭퍼에 이미지 주입
        setIsEditModeForCrop(isEdit); // 모드 설정
        setCropperOpen(true); // 모달 열기
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      });
      reader.readAsDataURL(selectedFile);
    }
    // 같은 파일을 다시 선택해도 이벤트가 발생하도록 value 초기화
    e.target.value = '';
  };

  // 크롭 완료 시 영역 저장
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // --- 2️⃣ 크롭 확인 & 압축 & 저장 핸들러 ---
  const onCropConfirm = async () => {
    if (!cropperImg || !croppedAreaPixels) return;

    try {
      // 1. 크롭 유틸리티를 통해 캔버스에서 Blob 추출
      const croppedBlob = await getCroppedImg(cropperImg, croppedAreaPixels);

      // 2. Blob -> File 객체로 변환 (compressImage가 File을 받기 때문)
      const rawFile = new File([croppedBlob], 'profile_cropped.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      console.log(
        '압축 전 용량:',
        (rawFile.size / 1024 / 1024).toFixed(2),
        'MB'
      );

      // 3. ✨ 주신 compressImage 함수로 압축 수행
      const compressedFile = await compressImage(rawFile);

      console.log(
        '압축 후 용량:',
        (compressedFile.size / 1024 / 1024).toFixed(2),
        'MB'
      );

      // 4. 미리보기 URL 생성 및 상태 업데이트
      const url = URL.createObjectURL(compressedFile);

      if (isEditModeForCrop) {
        setEditFile(compressedFile);
        setEditPreview(url);
        setIsImageDeleted(false);
      } else {
        setFile(compressedFile);
        setPreview(url);
      }

      setCropperOpen(false);
      setCropperImg(null);
    } catch (e) {
      console.error(e);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  // --- 3️⃣ 수정 모드에서 이미지 삭제 핸들러 ---
  const handleDeleteImage = () => {
    if (confirm('현재 이미지를 삭제하시겠습니까?')) {
      setEditFile(null);
      setEditPreview('');
      setIsImageDeleted(true); // 백엔드에 삭제 요청 보내기 위해 플래그 설정
    }
  };

  // --- 제출 핸들러 (등록) ---
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
      setForm((prev) => ({ ...prev, name: '', workplace: '', email: '' }));
      setFile(null);
      setPreview('');
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('등록 실패!');
    }
  };

  // 수정 버튼 클릭
  const handleEditClick = (member: Member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
    setEditFile(null);
    setIsImageDeleted(false); // 초기화
    setEditPreview(
      member.imageUrl ? `${import.meta.env.VITE_API_URL}${member.imageUrl}` : ''
    );
  };

  // --- 4️⃣ 수정 저장 핸들러 (이미지 삭제 로직 추가) ---
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

    // 새 파일이 있으면 전송
    if (editFile) {
      formData.append('image', editFile);
    }
    // 새 파일은 없는데 삭제 플래그가 켜져있으면 삭제 요청
    // (백엔드가 'deleteImage' 필드를 처리하도록 구현되어 있어야 합니다)
    else if (isImageDeleted) {
      formData.append('deleteImage', 'true');
    }

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

  const inputStyle =
    'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all';
  const smallInputStyle =
    'w-full bg-slate-950/80 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10">
      {/* ... 헤더 생략 ... */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-white">멤버 관리</h1>
        <p className="text-sm text-gray-400">
          새 멤버를 등록하거나 정보를 수정하세요.
        </p>
      </div>

      {/* 🟢 1. 등록 폼 */}
      <div className="bg-slate-800/50 backdrop-blur-md p-6 border border-white/10 rounded-2xl shadow-xl">
        <h2 className="text-lg font-bold text-white mb-6">새 멤버 등록</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* 사진 업로드 영역 */}
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
              {/* ✨ 파일 선택 시 onSelectFile 호출 */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onSelectFile(e, false)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            <p className="text-[10px] text-gray-500">권장 비율 4:5 · 최대 25MB</p>
          </div>

          {/* ... 나머지 등록 폼 입력 필드들 (기존 코드 유지) ... */}
          <div className="flex-1 flex flex-col justify-between gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      {/* 🟠 2. 기수 필터 (기존 유지) */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scroll px-1">
        {/* ... 필터 버튼들 (기존 코드 복붙) ... */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                {/* 이미지 수정 영역 */}
                <div className="flex justify-center mb-2 gap-2 items-end">
                  {/* 🖼 이미지 미리보기 Box */}
                  <div className="relative w-20 h-24 bg-slate-950 rounded border border-dashed border-white/30 overflow-hidden group">
                    <img
                      src={editPreview || '/no-image.png'}
                      className={`w-full h-full object-cover ${
                        isImageDeleted ? 'opacity-20' : 'opacity-80'
                      }`}
                      alt="edit"
                    />
                    {!isImageDeleted && (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                        변경
                      </div>
                    )}
                    {/* ✨ 수정 시에도 크롭퍼 onSelectFile 호출 */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onSelectFile(e, true)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </div>

                  {/* ✨ [추가된 기능] 이미지 삭제 버튼 */}
                  {editPreview && !isImageDeleted && (
                    <button
                      onClick={handleDeleteImage}
                      type="button"
                      className="w-7 h-7 flex items-center justify-center bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded transition-colors"
                      title="사진 삭제"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 text-center">최대 25MB</p>

                {/* 정보 수정 Inputs (기존 코드 유지) */}
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
              // 👁️ [보기 모드] (기존 코드 유지)
              <div className="flex gap-4 items-start h-full relative">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-white/10">
                  {member.imageUrl ? (
                    <img
                      src={
                        member.imageUrl.startsWith('http')
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

      {/* ✨ 4️⃣ 크롭 모달 UI */}
      {cropperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">
                이미지 자르기 (4:5)
              </h3>
              <button
                onClick={() => setCropperOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-[400px] bg-black">
              {cropperImg && (
                <Cropper
                  image={cropperImg}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 5} // ✨ 4:5 비율 고정
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* 줌 슬라이더 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCropperOpen(false)}
                  className="flex-1 py-3 bg-slate-800 text-gray-300 rounded-xl font-bold hover:bg-slate-700 transition"
                >
                  취소
                </button>
                <button
                  onClick={onCropConfirm}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/50"
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
