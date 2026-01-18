// src/pages/ResearchPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { assets } from '../../assets/assets';
import FooterBar from '../components/FooterBar';
import { api } from '../api/api';

// 백엔드 데이터 타입 정의
interface Research {
  id: number;
  title: string;
  type: string; // Weekly, Industry, etc.
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  createdAt: string; // ISO Date String (e.g., 2024-01-15T...)
}

const ResearchPage = () => {
  const [reports, setReports] = useState<Research[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.getResearch();
        // 최신순 정렬 (ID 내림차순 또는 날짜 내림차순)
        const sortedData = res.data.sort(
          (a: Research, b: Research) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReports(sortedData);
      } catch (err) {
        console.error('리서치 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 2. 월별 탭 생성 (YYYY.MM 형식)
  const availableMonths = useMemo(() => {
    if (reports.length === 0) return ['All'];

    const months = reports.map((item) => {
      const date = new Date(item.createdAt);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}.${month}`;
    });

    const uniqueMonths = Array.from(new Set(months)).sort((a, b) =>
      b.localeCompare(a)
    );
    return ['All', ...uniqueMonths];
  }, [reports]);

  // 3. 필터링 로직
  const filteredData = reports.filter((item) => {
    const date = new Date(item.createdAt);
    const itemMonth = `${date.getFullYear()}.${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;

    const matchesTab = activeTab === 'All' || itemMonth === activeTab;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // 날짜 포맷팅 함수 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-white pt-32 pb-10">
      <img
        src={assets.bg_research}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 h-full flex flex-col mb-3">
        {/* 전체 컨테이너 */}
        <div className="flex flex-col w-full h-full bg-black/40 backdrop-blur-xl p-8 mt-4 md:p-12 overflow-hidden border border-white/5 shadow-2xl rounded-sm">
          {/* [상단 영역] 타이틀 & 검색바 */}
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-fit">
              <h1 className="text-3xl font-bold tracking-tight text-white/80">
                Investment Concert
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-transparent mt-3" />
            </div>

            <div className="relative w-full md:w-[320px] group">
              <input
                type="text"
                placeholder="Search Reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-3 pl-5 pr-12 text-sm text-white/70 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-300"
              />
              <svg
                className="absolute right-4 top-3.5 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </header>

          {/* [중단 영역] Timeline 가로 탭 */}
          <div className="mb-12 border-b border-white/5">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-4 ml-1">
              Timeline
            </p>
            <nav className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {availableMonths.map((month) => (
                <button
                  key={month}
                  onClick={() => setActiveTab(month)}
                  className={`px-6 py-2.5 cursor-pointer rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeTab === month
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {month}
                </button>
              ))}
            </nav>
          </div>

          {/* [하단 영역] 리포트 카드 그리드 */}
          <section className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                {filteredData.map((item) => (
                  <article
                    key={item.id}
                    className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full min-h-[440px] pb-20 shadow-lg"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-full h-44 overflow-hidden bg-[#111] flex items-center justify-center border-b border-white/5">
                      {item.thumbnailUrl ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            item.thumbnailUrl
                          }`}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <img
                            src={assets.logo_uic}
                            className="w-16 opacity-20"
                            alt="logo"
                          />
                          <span className="text-xs text-white/20">
                            No Thumbnail
                          </span>
                        </div>
                      )}

                      {/* 타입 배지 (좌측 상단) */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur border border-white/10 text-[10px] font-bold text-blue-400 rounded-full uppercase tracking-wider">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4 text-[14px] font-medium text-white/30">
                        <span className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{' '}
                          {formatDate(item.createdAt)}
                        </span>
                        {/* 작성자 필드가 없으므로 제거하거나 고정값 사용 */}
                        <span className="text-xs border border-white/10 px-2 py-0.5 rounded text-white/20">
                          UIC Research
                        </span>
                      </div>
                      <h3 className="text-lg font-bold leading-[1.4] text-white/90 group-hover:text-white transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* 다운로드 버튼 */}
                    <div className="absolute bottom-6 left-6 right-6 h-12">
                      <a
                        href={`${import.meta.env.VITE_API_URL}${item.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        // download 속성은 cross-origin 정책 때문에 작동 안 할 수 있어 target="_blank" 추가
                        className="flex items-center justify-center w-full h-full gap-3 text-[13px] font-black tracking-widest uppercase
                                   text-white/40 bg-transparent border border-white/10 rounded-sm
                                   hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] 
                                   hover:border-blue-500/50 hover:text-white
                                   hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(30,58,138,0.4)]
                                   active:scale-[0.97] transition-all duration-500 group/btn cursor-pointer"
                      >
                        Download PDF
                        <svg
                          className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-white/20 font-medium border border-white/5 dashed rounded-lg gap-2">
                <p>해당 기간의 리포트가 존재하지 않습니다.</p>
              </div>
            )}
          </section>
        </div>
        <FooterBar />
      </div>
    </main>
  );
};

export default ResearchPage;
