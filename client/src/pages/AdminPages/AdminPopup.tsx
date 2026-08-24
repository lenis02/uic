import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { api } from '../../api/api';

interface PopupItem {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface FormState {
  linkUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface PeriodForm {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const emptyForm: FormState = {
  linkUrl: '',
  startDate: '',
  startTime: '00:00',
  endDate: '',
  endTime: '23:59',
};

const emptyPeriod: PeriodForm = {
  startDate: '',
  startTime: '00:00',
  endDate: '',
  endTime: '23:59',
};

const inputStyle =
  'w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all';

function splitDatetime(iso: string) {
  if (!iso) return { date: '', time: '00:00' };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('sv-SE'),
    time: d.toTimeString().slice(0, 5),
  };
}

function combine(date: string, time: string) {
  return `${date}T${time}`;
}

function isLive(popup: PopupItem) {
  const now = new Date();
  return popup.isActive && new Date(popup.startDate) <= now && new Date(popup.endDate) >= now;
}

function toDate(dateStr: string, timeStr: string): Date | null {
  if (!dateStr) return null;
  return new Date(`${dateStr}T${timeStr || '00:00'}`);
}

function PeriodPicker({
  startDate, startTime, endDate, endTime,
  onStartDateChange, onStartTimeChange, onEndDateChange, onEndTimeChange,
}: {
  startDate: string; startTime: string; endDate: string; endTime: string;
  onStartDateChange: (v: string) => void; onStartTimeChange: (v: string) => void;
  onEndDateChange: (v: string) => void; onEndTimeChange: (v: string) => void;
}) {
  const pickerInput = (placeholder: string) =>
    React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      ({ value, onClick }, ref) => (
        <input
          ref={ref}
          readOnly
          value={value as string}
          onClick={onClick}
          placeholder={placeholder}
          className={`${inputStyle} cursor-pointer`}
        />
      )
    );

  const DateInput = pickerInput('날짜 선택');
  const TimeInput = pickerInput('시간 선택');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-xs text-gray-400 pl-1 block">시작 날짜</label>
        <DatePicker
          selected={toDate(startDate, startTime)}
          onChange={(d: Date | null) => onStartDateChange(d ? d.toLocaleDateString('sv-SE') : '')}
          dateFormat="yyyy.MM.dd"
          customInput={<DateInput />}
          popperPlacement="bottom-start"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400 pl-1 block">종료 날짜</label>
        <DatePicker
          selected={toDate(endDate, endTime)}
          onChange={(d: Date | null) => onEndDateChange(d ? d.toLocaleDateString('sv-SE') : '')}
          dateFormat="yyyy.MM.dd"
          customInput={<DateInput />}
          popperPlacement="bottom-start"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400 pl-1 block">시작 시간</label>
        <DatePicker
          selected={toDate(startDate, startTime)}
          onChange={(d: Date | null) => onStartTimeChange(d ? d.toTimeString().slice(0, 5) : '00:00')}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          customInput={<TimeInput />}
          popperPlacement="bottom-start"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400 pl-1 block">종료 시간</label>
        <DatePicker
          selected={toDate(endDate, endTime)}
          onChange={(d: Date | null) => onEndTimeChange(d ? d.toTimeString().slice(0, 5) : '23:59')}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          dateFormat="HH:mm"
          timeFormat="HH:mm"
          customInput={<TimeInput />}
          popperPlacement="bottom-start"
        />
      </div>
    </div>
  );
}

export default function AdminPopup() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  // 켜기 버튼 클릭 시 기간 재설정 폼
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [periodForm, setPeriodForm] = useState<PeriodForm>(emptyPeriod);

  const fetchPopups = async () => {
    try {
      const res = await api.getPopups();
      setPopups(res.data);
    } catch {
      console.error('팝업 목록 불러오기 실패');
    }
  };

  useEffect(() => { fetchPopups(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (isEdit) { setEditFile(f); setEditPreview(url); }
    else { setFile(f); setPreview(url); }
  };

  const validatePeriod = (startDate: string, startTime: string, endDate: string, endTime: string) => {
    if (!startDate || !endDate) { alert('기간을 입력해주세요.'); return false; }
    if (combine(startDate, startTime) >= combine(endDate, endTime)) {
      alert('종료일시는 시작일시보다 이후여야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert('이미지를 선택해주세요.'); return; }
    if (!validatePeriod(form.startDate, form.startTime, form.endDate, form.endTime)) return;

    const fd = new FormData();
    fd.append('image', file);
    fd.append('startDate', combine(form.startDate, form.startTime));
    fd.append('endDate', combine(form.endDate, form.endTime));
    if (form.linkUrl) fd.append('linkUrl', form.linkUrl);
    fd.append('isActive', 'true');

    try {
      await api.createPopup(fd);
      setForm(emptyForm);
      setFile(null);
      setPreview('');
      if (fileRef.current) fileRef.current.value = '';
      fetchPopups();
    } catch {
      alert('등록 실패');
    }
  };

  const startEdit = (popup: PopupItem) => {
    const s = splitDatetime(popup.startDate);
    const e = splitDatetime(popup.endDate);
    setEditingId(popup.id);
    setActivatingId(null);
    setEditForm({ linkUrl: popup.linkUrl ?? '', startDate: s.date, startTime: s.time, endDate: e.date, endTime: e.time });
    setEditFile(null);
    setEditPreview(popup.imageUrl);
  };

  const handleUpdate = async (id: number) => {
    if (!validatePeriod(editForm.startDate, editForm.startTime, editForm.endDate, editForm.endTime)) return;

    const fd = new FormData();
    if (editFile) fd.append('image', editFile);
    fd.append('startDate', combine(editForm.startDate, editForm.startTime));
    fd.append('endDate', combine(editForm.endDate, editForm.endTime));
    fd.append('linkUrl', editForm.linkUrl);

    try {
      await api.updatePopup(id, fd);
      setEditingId(null);
      fetchPopups();
    } catch {
      alert('수정 실패');
    }
  };

  const handleTurnOff = async (id: number) => {
    const fd = new FormData();
    fd.append('isActive', 'false');
    try {
      await api.updatePopup(id, fd);
      fetchPopups();
    } catch {
      alert('비활성화 실패');
    }
  };

  const handleTurnOn = async (id: number) => {
    if (!validatePeriod(periodForm.startDate, periodForm.startTime, periodForm.endDate, periodForm.endTime)) return;

    const fd = new FormData();
    fd.append('startDate', combine(periodForm.startDate, periodForm.startTime));
    fd.append('endDate', combine(periodForm.endDate, periodForm.endTime));
    fd.append('isActive', 'true');

    try {
      await api.updatePopup(id, fd);
      setActivatingId(null);
      setPeriodForm(emptyPeriod);
      fetchPopups();
    } catch {
      alert('활성화 실패');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.deletePopup(id);
      fetchPopups();
    } catch {
      alert('삭제 실패');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white/90">팝업 관리</h1>
        <p className="text-sm text-gray-300">메인 화면에 표시될 팝업 이미지를 기간별로 관리합니다.</p>
      </div>

      {/* 등록 폼 */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 border border-white/10 shadow-xl rounded-2xl mx-2">
        <h3 className="text-lg font-bold text-white/80 mb-4 ml-1">새 팝업 등록</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors min-h-[140px]"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} className="max-h-40 rounded-lg object-contain" />
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">JPG / PNG / WebP 이미지 선택 (WebP로 저장)</p>
                <p className="text-gray-500 text-xs">최대 4MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={(e) => handleFileChange(e)} />
          </div>

          <PeriodPicker
            startDate={form.startDate} startTime={form.startTime}
            endDate={form.endDate} endTime={form.endTime}
            onStartDateChange={(v) => setForm({ ...form, startDate: v })}
            onStartTimeChange={(v) => setForm({ ...form, startTime: v })}
            onEndDateChange={(v) => setForm({ ...form, endDate: v })}
            onEndTimeChange={(v) => setForm({ ...form, endTime: v })}
          />

          <input placeholder="링크 URL (선택, 클릭 시 이동)" className={inputStyle}
            value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />

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
          <h3 className="text-lg font-bold text-white/80">등록된 팝업 목록</h3>
          <span className="text-xs text-gray-300">총 {popups.length}개</span>
        </div>

        {popups.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 text-gray-500">
            등록된 팝업이 없습니다.
          </div>
        ) : (
          <div className="grid gap-4">
            {popups.map((popup) => (
              <div key={popup.id}
                className="group bg-slate-900/50 hover:bg-slate-800/60 border border-white/5 hover:border-blue-500/30 rounded-xl p-5 transition-all duration-300">

                {editingId === popup.id ? (
                  /* ── 수정 모드 ── */
                  <div className="space-y-3">
                    <div
                      className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors min-h-[120px]"
                      onClick={() => editFileRef.current?.click()}
                    >
                      {editPreview
                        ? <img src={editPreview} className="max-h-36 rounded-lg object-contain" />
                        : <>
                            <p className="text-gray-500 text-sm">이미지 클릭하여 교체</p>
                            <p className="text-gray-500 text-xs">최대 4MB</p>
                          </>}
                      <input ref={editFileRef} type="file" accept="image/jpeg,image/png,image/webp"
                        className="hidden" onChange={(e) => handleFileChange(e, true)} />
                    </div>
                    <PeriodPicker
                      startDate={editForm.startDate} startTime={editForm.startTime}
                      endDate={editForm.endDate} endTime={editForm.endTime}
                      onStartDateChange={(v) => setEditForm({ ...editForm, startDate: v })}
                      onStartTimeChange={(v) => setEditForm({ ...editForm, startTime: v })}
                      onEndDateChange={(v) => setEditForm({ ...editForm, endDate: v })}
                      onEndTimeChange={(v) => setEditForm({ ...editForm, endTime: v })}
                    />
                    <input placeholder="링크 URL (선택)" className={inputStyle}
                      value={editForm.linkUrl} onChange={(e) => setEditForm({ ...editForm, linkUrl: e.target.value })} />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm">
                        취소
                      </button>
                      <button onClick={() => handleUpdate(popup.id)}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer">
                        저장
                      </button>
                    </div>
                  </div>

                ) : activatingId === popup.id ? (
                  /* ── 켜기 기간 설정 모드 ── */
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300 font-medium">노출 기간을 설정해주세요</p>
                    <PeriodPicker
                      startDate={periodForm.startDate} startTime={periodForm.startTime}
                      endDate={periodForm.endDate} endTime={periodForm.endTime}
                      onStartDateChange={(v) => setPeriodForm({ ...periodForm, startDate: v })}
                      onStartTimeChange={(v) => setPeriodForm({ ...periodForm, startTime: v })}
                      onEndDateChange={(v) => setPeriodForm({ ...periodForm, endDate: v })}
                      onEndTimeChange={(v) => setPeriodForm({ ...periodForm, endTime: v })}
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setActivatingId(null)}
                        className="px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer text-sm">
                        취소
                      </button>
                      <button onClick={() => handleTurnOn(popup.id)}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer">
                        켜기
                      </button>
                    </div>
                  </div>

                ) : (
                  /* ── 보기 모드 ── */
                  <div className="flex flex-col md:flex-row gap-4">
                    <img src={popup.imageUrl} className="w-full md:w-48 h-32 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isLive(popup) ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">노출 중</span>
                          ) : popup.isActive ? (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">기간 외</span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30">꺼짐</span>
                          )}
                        </div>
                        {popup.linkUrl && <p className="text-blue-400 text-xs truncate">{popup.linkUrl}</p>}
                        <p className="text-gray-500 text-xs">
                          {new Date(popup.startDate).toLocaleString('ko-KR')} ~ {new Date(popup.endDate).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {isLive(popup) ? (
                          <button onClick={() => handleTurnOff(popup.id)}
                            className="px-3 py-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-colors text-sm font-medium cursor-pointer">
                            끄기
                          </button>
                        ) : (
                          <button onClick={() => { setActivatingId(popup.id); setEditingId(null); setPeriodForm(emptyPeriod); }}
                            className="px-3 py-1.5 rounded-lg text-green-400 hover:text-white hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 transition-colors text-sm font-medium cursor-pointer">
                            켜기
                          </button>
                        )}
                        <button onClick={() => startEdit(popup)}
                          className="px-3 py-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500/20 transition-colors text-sm font-medium opacity-70 group-hover:opacity-100 cursor-pointer">
                          수정
                        </button>
                        <button onClick={() => handleDelete(popup.id)}
                          className="px-3 py-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-colors text-sm font-medium opacity-70 group-hover:opacity-100 cursor-pointer">
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
