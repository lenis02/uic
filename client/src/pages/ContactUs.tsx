import React from 'react';
import { assets } from '../../assets/assets';

const ContactUs = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('문의사항이 접수되었습니다.');
  };

  // [수정] 입력 필드: 밝은 배경에 어울리는 화이트 톤 + 진한 텍스트
  const inputClasses =
    'w-full bg-white/50 border border-gray-200 rounded-xl p-5 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10 outline-none transition-all duration-300 backdrop-blur-sm';

  // [수정] 라벨: 진한 회색으로 가독성 확보
  const labelClasses =
    'text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1 mb-2 block';

  return (
    // 섹션 배경은 투명(transparent) 유지
    <section
      id="contact"
      className="relative h-screen w-full snap-start flex flex-col items-center justify-center p-6 overflow-hidden bg-transparent"
    >
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* [메인 카드 컨테이너]  */}
      <div
        className="relative mt-24 z-10 w-full max-w-[1200px] min-h-[700px] rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60"
        style={{
          backdropFilter: 'blur(30px)', // 블러 효과
          backgroundColor: 'rgba(255, 255, 255, 0.65)', // 밝은 화이트 글래스 색상
        }}
      >
        {/* [왼쪽 영역] 브랜드 메시지 (약간 더 투명한 화이트) */}
        <div className="flex-1 p-12 md:p-16 bg-white/30 flex flex-col justify-between relative overflow-hidden border-r border-white/40">
          {/* 내부 장식: 은은한 보라색 빛 */}
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-400/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

          <div className="relative z-10">
            {/* 텍스트 색상을 어두운 톤(Gray-900)으로 변경 */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              Let's create <br />
              future{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                together.
              </span>
            </h2>
            <p className="text-lg md:text-m text-gray-600 font-medium leading-relaxed max-w-md">
              UIC는 여러분의 혁신적인 아이디어와 열정을 기다립니다.{' '}
              <br className="hidden md:block" />
              금융의 새로운 챕터를 함께 열어갈 준비가 되셨나요?
            </p>
          </div>

          {/* 연락처 정보 */}
          <div className="relative z-10 space-y-8 mt-12 md:mt-0">
            {[
              {
                label: 'Address',
                value: '서울특별시 중구 필동로 1길 30, UIC 본부',
                icon: '📍',
              },
              {
                label: 'Direct Contact',
                value: `부회장 황민성 +82 10-5713-6900`,
                icon: '📞',
              },
              {
                label: 'Official Email',
                value: 'uic_official@naver.com',
                icon: '✉️',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-white/50 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-purple-600 uppercase font-bold tracking-[0.2em] mb-1">
                    {item.label}
                  </p>
                  <p className="text-base font-bold text-gray-800 tracking-wide">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [오른쪽 영역] 문의하기 폼 (더 불투명한 화이트) */}
        <div className="flex-[1.3] p-12 md:p-16 bg-white/60 relative flex flex-col justify-center">
          {/* 내부 장식: 은은한 파란색 빛 */}
          <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

          <div className="relative z-10 mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Send us a message
            </h3>
            <p className="text-gray-500">빠른 시일 내에 답변 드리겠습니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Your Name</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Your Email Address</label>
                <input
                  type="email"
                  placeholder="example@uic.com"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Message</label>
              <textarea
                rows={6}
                placeholder="문의하실 내용을 자유롭게 적어주세요."
                className={`${inputClasses} resize-none`}
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-6">
              {/* SNS 아이콘 */}
              <div className="flex gap-3">
                {[
                  {
                    src: assets.logo_instagram,
                    alt: 'Instagram',
                    border: 'hover:border-purple-300',
                    link: 'https://www.instagram.com/uic.korea/',
                  },
                  {
                    src: assets.logo_kakao,
                    alt: 'Kakao',
                    border: 'hover:border-yellow-300',
                    link: 'https://pf.kakao.com/_xfecmM',
                  },
                  {
                    src: assets.logo_naver_cafe,
                    alt: 'Naver Cafe',
                    border: 'hover:border-green-300',
                    link: 'https://cafe.naver.com/koreauic.cafe',
                  },
                ].map((sns, idx) => (
                  <a
                    key={idx}
                    href={sns.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${sns.border}`}
                  >
                    <img
                      src={sns.src}
                      alt={sns.alt}
                      className="w-7 h-7 opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </a>
                ))}
              </div>

              <button
                type="submit"
                className="px-12 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-95"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 하단 푸터 텍스트 (배경에 따라 잘 보이도록 밝은색 유지, 필요시 drop-shadow 추가) */}
      <p className="mt-8 text-white/60 text-[13px] tracking-[0.4em] uppercase select-none drop-shadow-md">
        University student Investment Club · All rights reserved.
      </p>
    </section>
  );
};

export default ContactUs;
