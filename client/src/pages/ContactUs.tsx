import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import FooterBar from '../components/FooterBar';

const ContactUs = () => {
  // [1] 상태 관리 (폼 데이터, 로딩 상태, 복사 상태)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // [2] 입력값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // [3] 폼 제출 핸들러 (백엔드 API 호출)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!formData.name || !formData.email || !formData.message) {
      return alert('이름, 이메일, 내용을 모두 입력해 주세요.');
    }

    try {
      setLoading(true);

      // 백엔드 주소 (VITE_API_URL 환경변수가 없으면 기본값 localhost:3000 사용)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // 백엔드(DTO)에서 보낸 에러 메시지 처리
        throw new Error(data.message || '전송 실패');
      }

      // 성공 처리
      alert('문의사항이 성공적으로 접수되었습니다! 곧 답변 드리겠습니다.');
      setFormData({ name: '', email: '', message: '' }); // 폼 초기화
    } catch (error: any) {
      console.error('Email sending failed:', error);
      // 에러 메시지가 배열인 경우(class-validator)와 문자열인 경우 모두 처리
      const errorMessage = Array.isArray(error.message)
        ? error.message[0]
        : error.message || '전송 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 클립보드 복사 함수 (기존 유지)
  const handleCopy = (text: string, label: string) => {
    const cleanText =
      label === 'Direct Contact' ? text.replace(/[^0-9+]/g, '') : text;
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopyStatus(`${label} 복사 완료!`);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const inputClasses =
    'w-full bg-white/5 border border-white/10 p-5 text-sm text-white placeholder-gray-300 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed';

  const labelClasses =
    'text-[11px] uppercase tracking-[0.2em] text-gray-300 font-black ml-1 mb-2 block';

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden bg-[#050505]"
    >
      <img
        src={assets.bg_contact}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      {/* 복사 알림 토스트 */}
      <div
        className={`fixed top-24 z-[120] transition-all duration-500 transform ${
          copyStatus ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        <div className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] text-sm">
          {copyStatus}
        </div>
      </div>

      <div className="relative mt-32 z-10 w-full max-w-[1200px] min-h-[650px] rounded-sm overflow-hidden flex flex-col md:flex-row bg-black/40 backdrop-blur-md border border-white/5 shadow-2xl">
        {/* [왼쪽 영역] 연락처 정보 */}
        <div className="flex-1 p-12 md:p-16 flex flex-col justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
          <div className="absolute -left-10 -bottom-10 opacity-[0.03] select-none pointer-events-none">
            <img src={assets.logo_uic} alt="" className="w-[500px] grayscale" />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="text-center md:text-left">
              <h2 className="text-sm font-black tracking-[0.4em] text-blue-500 uppercase mb-2">
                Contact Info
              </h2>
              <p className="text-xs text-gray-300 uppercase tracking-widest">
                Click to copy details
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  label: 'Direct Contact',
                  value: `+82 10-3607-6307`,
                  sub: '회장 이동원',
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  ),
                },
                {
                  label: 'Direct Contact',
                  value: `+82 10-5173-6900`,
                  sub: '부회장 황민성',
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  ),
                },
                {
                  label: 'Official Email',
                  value: 'koreauic@gmail.com',
                  sub: '공식 이메일',
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopy(item.value, item.label)}
                  className="w-full cursor-pointer flex items-center gap-6 p-6 bg-black/30 border border-white/5 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500 group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 uppercase font-black tracking-[0.2em] mb-1">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-white/90">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">{item.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* [오른쪽 영역] 문의하기 폼 */}
        <div className="flex-[1.3] p-12 md:p-16 bg-white/[0.01] relative flex flex-col justify-center">
          <div className="group w-fit">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white/80">
              Send us a message
            </h3>
            <div className="mb-4 w-full h-[2px] bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_15px_rgba(34,211,238,0.4)] mt-4 transition-all duration-500 group-hover:scale-x-110" />
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className={labelClasses}>Your Name</label>
                <input
                  type="text"
                  name="name" // name 속성 추가
                  value={formData.name} // value 연결
                  onChange={handleChange} // 핸들러 연결
                  disabled={loading} // 로딩 중 비활성화
                  placeholder="성함 또는 기업명"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Your Email</label>
                <input
                  type="email"
                  name="email" // name 속성 추가
                  value={formData.email} // value 연결
                  onChange={handleChange} // 핸들러 연결
                  disabled={loading} // 로딩 중 비활성화
                  placeholder="example@uic.com"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Message</label>
              <textarea
                rows={5}
                name="message" // name 속성 추가
                value={formData.message} // value 연결
                onChange={handleChange} // 핸들러 연결
                disabled={loading} // 로딩 중 비활성화
                placeholder="문의 내용을 자유롭게 입력해 주세요."
                className={`${inputClasses} resize-none`}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6">
              <div className="flex gap-4">
                {[
                  {
                    src: assets.logo_instagram,
                    link: 'https://www.instagram.com/uic.korea/',
                    hover: 'hover:border-purple-500/50',
                  },
                  {
                    src: assets.logo_kakao,
                    link: 'https://pf.kakao.com/_xfecmM',
                    hover: 'hover:border-yellow-500/50',
                  },
                  {
                    src: assets.logo_naver_cafe,
                    link: 'https://cafe.naver.com/koreauic.cafe',
                    hover: 'hover:border-green-500/50',
                  },
                ].map((sns, idx) => (
                  <a
                    key={idx}
                    href={sns.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={sns.src}
                      alt="SNS"
                      className="w-7 h-7 opacity-40 hover:opacity-100 transition-opacity"
                    />
                  </a>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading} // 로딩 중 클릭 방지
                className={`w-full sm:w-auto px-12 py-4 text-xs font-black tracking-[0.2em] uppercase
                           bg-transparent border border-white/10
                           transition-all duration-500
                           ${
                             loading
                               ? 'opacity-50 cursor-not-allowed text-gray-500'
                               : 'text-white/60 hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] hover:border-blue-500/50 hover:text-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(30,58,138,0.4)] active:scale-[0.97]'
                           }`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <FooterBar />
    </section>
  );
};

export default ContactUs;
