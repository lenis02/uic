import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

type JoinFormType = 'club' | 'individual' | 'joint';

interface JoinForm {
  type: JoinFormType;
  description: string;
  bullets: string;
  fileUrl: string | null;
  fileName: string | null;
}

// 탭 라벨과 카드 제목 색상은 JoinUs 페이지의 카드와 맞춰둔다.
const TABS: { type: JoinFormType; label: string; cardTitle: string }[] = [
  { type: 'club', label: '동아리', cardTitle: 'Club Membership' },
  { type: 'individual', label: '개인', cardTitle: 'Individual Membership' },
  { type: 'joint', label: '연합세션', cardTitle: 'Joint Session' },
];

const ACCEPT = '.pptx,.docx,.hwp';

const labelStyle = 'block text-sm font-medium text-gray-300 mb-2';
const inputStyle =
  'w-full bg-slate-950/50 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-300 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

const errorMessage = (err: unknown) => {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join('\n') : (msg ?? '알 수 없는 오류');
};

const emptyForm = (type: JoinFormType): JoinForm => ({
  type,
  description: '',
  bullets: '',
  fileUrl: null,
  fileName: null,
});

export default function AdminJoinus() {
  const [selected, setSelected] = useState<JoinFormType>('club');
  const [forms, setForms] = useState<Record<JoinFormType, JoinForm>>({
    club: emptyForm('club'),
    individual: emptyForm('individual'),
    joint: emptyForm('joint'),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchForms = async () => {
    try {
      const res = await api.getJoinForms();
      const next = {
        club: emptyForm('club'),
        individual: emptyForm('individual'),
        joint: emptyForm('joint'),
      };
      (res.data as JoinForm[]).forEach((form) => {
        next[form.type] = { ...emptyForm(form.type), ...form };
      });
      setForms(next);
    } catch (err) {
      console.error('지원 안내 로딩 실패:', err);
      alert(`데이터를 불러오지 못했습니다: ${errorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // 탭을 옮기면 고르던 파일은 버린다. 다른 카드에 잘못 올라가면 안 되기 때문.
  useEffect(() => {
    setFile(null);
  }, [selected]);

  const current = forms[selected];
  const currentTab = TABS.find((t) => t.type === selected)!;

  const patchCurrent = (partial: Partial<JoinForm>) =>
    setForms((prev) => ({
      ...prev,
      [selected]: { ...prev[selected], ...partial },
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const formData = new FormData();
    formData.append('description', current.description);
    formData.append('bullets', current.bullets);
    if (file) formData.append('file', file);

    setSaving(true);
    try {
      await api.updateJoinForm(selected, formData);
      alert(`${currentTab.label} 지원 안내가 저장되었습니다.`);
      setFile(null);
      await fetchForms();
    } catch (err) {
      alert(`저장 실패: ${errorMessage(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 px-2">불러오는 중...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-10">
      {/* 헤더 */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">
          지원 안내 관리
        </h1>
        <p className="text-sm text-gray-300">
          Join Us 페이지의 카드 3종 문구와 지원서 양식 파일을 관리합니다.
        </p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit border border-white/5 mx-2">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setSelected(tab.type)}
            className={`px-6 cursor-pointer py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
              selected === tab.type
                ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2 space-y-5"
      >
        <div className="text-xs text-gray-500 tracking-widest uppercase">
          {currentTab.cardTitle}
        </div>

        <div>
          <label className={labelStyle}>설명 문구</label>
          <textarea
            value={current.description}
            onChange={(e) => patchCurrent({ description: e.target.value })}
            rows={2}
            className={`${inputStyle} resize-none leading-relaxed text-sm`}
            placeholder="예: 동아리 가입을 위한 단체 지원 프로세스입니다."
            required
          />
        </div>

        <div>
          <label className={labelStyle}>불릿 (한 줄에 한 항목)</label>
          <textarea
            value={current.bullets}
            onChange={(e) => patchCurrent({ bullets: e.target.value })}
            rows={4}
            className={`${inputStyle} resize-none leading-relaxed text-sm`}
            placeholder={'PDF 형식 변환 제출 준수\n활동 계획서 및 동아리 소개서 필수'}
          />
          <p className="mt-2 text-[11px] text-gray-500">
            줄바꿈 한 번이 불릿 하나입니다.
          </p>
        </div>

        {/* 지원서 양식 파일 */}
        <div>
          <label className={labelStyle}>지원서 양식 파일</label>

          <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-xs text-gray-500 shrink-0 w-20">
                현재 파일
              </span>
              {current.fileUrl ? (
                <a
                  href={current.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-300 hover:text-blue-200 underline underline-offset-4 break-all"
                >
                  {current.fileName ?? current.fileUrl}
                </a>
              ) : (
                <span className="text-sm text-gray-500">
                  등록된 파일이 없습니다.
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-xs text-gray-500 shrink-0 w-20">
                새 파일
              </span>
              <input
                type="file"
                accept={ACCEPT}
                onChange={handleFileChange}
                className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white/10 file:text-gray-200 hover:file:bg-white/20 file:cursor-pointer cursor-pointer"
              />
            </div>

            {file && (
              <p className="text-xs text-cyan-300">
                저장 시 <span className="font-bold">{file.name}</span> 으로
                교체됩니다.
              </p>
            )}
          </div>

          <p className="mt-2 text-[11px] text-gray-500">
            PPTX / DOCX / HWP, 최대 25MB. 파일을 고르지 않으면 기존 파일이
            그대로 유지됩니다.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white py-3.5 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-blue-900/40 hover:scale-[1.005] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {saving ? '저장 중...' : '변경사항 저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
