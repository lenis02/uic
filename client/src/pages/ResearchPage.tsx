import { useState, useMemo, useEffect } from 'react';
import { assets } from '../../assets/assets';
import FooterBar from '../components/FooterBar';
import { api } from '../api/api';

// 백엔드 데이터 타입 정의
interface Research {
  id: number;
  title: string;
  category: string;
  author: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
}

// ✅ 카테고리 목록
const CATEGORIES = ['전체', '경제', '산업', '정책', '금융', '기술', '기타'];

// ✅ 정렬 옵션
const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '조회순', value: 'views' },
  { label: '등록순', value: 'oldest' },
];

const ResearchPage = () => {
  const [reports, setReports] = useState<Research[]>([]);
  const [activeCategory, setActiveCategory] = useState('전체'); // 탭 상태
  const [sortBy, setSortBy] = useState('latest'); // 정렬 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.getResearch();
        setReports(res.data);
      } catch (err) {
        console.error('리서치 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 2. ✨ 필터링 및 정렬 로직
  const processedReports = useMemo(() => {
    let result = [...reports];

    // (1) 검색어 필터
    if (searchTerm) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // (2) 카테고리 필터
    if (activeCategory !== '전체') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // (3) 정렬 로직
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortBy === 'latest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'views') return b.views - a.views;
      return 0;
    });

    return result;
  }, [reports, activeCategory, sortBy, searchTerm]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 이미지 URL 처리
  const getImageUrl = (url: string) => {
    if (!url) return null;
    return url.startsWith('http')
      ? url
      : `${import.meta.env.VITE_API_URL}${url}`;
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

          {/* [중단 영역] Category 탭 (이전 Timeline 스타일 복원) */}
          <div className="mb-12 border-b border-white/5 flex flex-col lg:flex-row justify-between items-end gap-4 pb-4">
            <div className="w-full lg:w-auto overflow-hidden">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-4 ml-1">
                Category
              </p>
              {/* 👇 여기가 이전 스타일 그대로 가져온 부분입니다 */}
              <nav className="flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 cursor-pointer rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            {/* 정렬 드롭다운 (우측 하단 배치) */}
            <div className="relative min-w-[120px] mb-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white/70 text-xs font-medium rounded px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none uppercase tracking-wide"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-white/30">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* [하단 영역] 리포트 카드 그리드 */}
          <section className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
            {processedReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
                {processedReports.map((item) => (
                  <article
                    key={item.id}
                    className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full min-h-[340px] pb-20 shadow-lg"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-full h-44 overflow-hidden bg-[#111] flex items-center justify-center border-b border-white/5">
                      {item.thumbnailUrl ? (
                        <img
                          src={getImageUrl(item.thumbnailUrl) || ''}
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

                      {/* 조회수 뱃지 */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] text-white/60 flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5 text-white"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className="font-medium">{item.views}</span>
                      </div>

                      {/* 카테고리 뱃지 (카드 위) */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur border border-white/10 text-[10px] font-bold text-blue-400 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4 text-[13px] font-medium text-white/40">
                        <span className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{' '}
                          {formatDate(item.createdAt)}
                        </span>

                        <span className="text-white/60 text-xs border border-white/10 px-2 py-0.5 rounded">
                          {item.author}
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
                        href={getImageUrl(item.pdfUrl) || '#'}
                        target="_blank"
                        rel="noreferrer"
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
                <p>해당 조건의 리포트가 존재하지 않습니다.</p>
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
