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

// ✅ 정렬 옵션
const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '조회순', value: 'views' },
  { label: '등록순', value: 'oldest' },
];

const ResearchPage = () => {
  const [reports, setReports] = useState<Research[]>([]);
  // 🔄 변경 1: 카테고리 상태 대신 연도 상태 사용
  const [activeYear, setActiveYear] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');
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

  // ✨ 추가: 데이터에서 연도 목록 동적 추출 (내림차순 정렬)
  const years = useMemo(() => {
    if (reports.length === 0) return ['전체'];

    // createdAt에서 연도만 추출하여 중복 제거
    const uniqueYears = Array.from(
      new Set(reports.map((item) => new Date(item.createdAt).getFullYear())),
    );

    // 내림차순 정렬 (2026, 2025...) 후 문자열 변환
    const sortedYears = uniqueYears.sort((a, b) => b - a).map(String);

    return ['전체', ...sortedYears];
  }, [reports]);

  // 2. ✨ 필터링 및 정렬 로직
  const processedReports = useMemo(() => {
    let result = [...reports];

    // (1) 검색어 필터
    if (searchTerm) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 🔄 변경 2: 연도 필터링 로직 적용
    if (activeYear !== '전체') {
      result = result.filter((item) => {
        const itemYear = new Date(item.createdAt).getFullYear().toString();
        return itemYear === activeYear;
      });
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
  }, [reports, activeYear, sortBy, searchTerm]); // 의존성 배열 activeYear로 변경

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // 이미지 URL 처리
  const getImageUrl = (url: string) => {
    if (!url) return null;
    return url.startsWith('http')
      ? url
      : `${import.meta.env.VITE_API_URL}${url}`;
  };

  const handleDownload = (e: React.MouseEvent, item: Research) => {
    e.preventDefault();

    const originalUrl = getImageUrl(item.pdfUrl);
    if (!originalUrl) return alert('PDF 파일이 없습니다.');

    // 1. 조회수 집계
    api
      .increaseResearchView(item.id)
      .catch((err) => console.error('조회수 집계 실패:', err));

    // 2. 화면 즉시 업데이트
    setReports((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, views: r.views + 1 } : r)),
    );

    // 3. 파일명 커스터마이징
    let downloadUrl = originalUrl;

    if (originalUrl.includes('/upload/')) {
      const safeTitle = item.title
        .replace(/[^a-zA-Z0-9가-힣\s_-]/g, '')
        .trim()
        .replace(/\s+/g, '_');

      downloadUrl = originalUrl.replace(
        '/upload/',
        `/upload/fl_attachment:${safeTitle}/`,
      );
    }

    // 4. 다운로드 실행
    try {
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('다운로드 시작 실패s:', error);
      window.open(originalUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-white pt-20 md:pt-32 pb-4 md:pb-10">
      <img
        src={assets.bg_research}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      {/* 모바일 양옆 패딩 좁힘 (px-4) */}
      <div className="relative mt-4 md:mt-0 z-10 max-w-[1400px] mx-auto px-4 md:px-6 h-full flex flex-col mb-3">
        {/* 전체 컨테이너 모바일 패딩 조정 (p-4) */}
        <div className="flex flex-col w-full h-full bg-black/40 backdrop-blur-xl p-4 md:p-8 lg:p-12 overflow-hidden border border-white/5 shadow-2xl rounded-lg md:rounded-sm mt-4">
          {/* [상단 영역] 타이틀 & 검색바 */}
          <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="w-fit shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white/80">
                투자 콘서트 수상작
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-transparent mt-2 md:mt-3" />
            </div>

            <div className="relative w-full md:w-[320px] group shrink-0">
              <input
                type="text"
                placeholder="Search Reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-2.5 md:py-3 pl-4 md:pl-5 pr-10 md:pr-12 text-xs md:text-sm text-white/70 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-300 rounded"
              />
              <svg
                className="absolute right-3 md:right-4 top-2.5 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-white/30 group-focus-within:text-blue-400 transition-colors"
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

          {/* [중단 영역] Year 탭 및 정렬 */}
          {/* 모바일에서 정렬(select) 박스가 너무 크지 않게 적절히 배치 */}
          <div className="mb-6 md:mb-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4 pb-3 md:pb-4 shrink-0">
            <div className="w-full md:w-auto overflow-hidden">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-2 md:mb-4 ml-1">
                Year
              </p>

              {/* 연도 탭 가로 스크롤 허용 */}
              <nav className="flex flex-row gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setActiveYear(year)}
                    className={`px-4 md:px-6 py-2 md:py-2.5 cursor-pointer rounded-lg text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      activeYear === year
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/50 shadow-[0_4px_15px_rgba(37,99,235,0.2)]'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </nav>
            </div>

            {/* 정렬 드롭다운 */}
            <div className="relative w-full md:w-auto min-w-[120px] mb-1 md:mb-2 self-end md:self-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto bg-black/60 border border-white/10 text-white/70 text-[10px] md:text-xs font-medium rounded px-3 py-2 md:py-2 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none uppercase tracking-wide"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 md:top-2.5 pointer-events-none text-white/30">
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
          <section className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar scrollbar-hide">
            {processedReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 pb-10">
                {processedReports.map((item) => (
                  <article
                    key={item.id}
                    className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full min-h-[300px] md:min-h-[340px] pb-20 shadow-lg rounded-xl md:rounded-sm"
                  >
                    {/* 썸네일 (모바일은 높이를 살짝 축소 h-36) */}
                    <div className="relative w-full h-36 md:h-44 overflow-hidden bg-[#111] flex items-center justify-center border-b border-white/5">
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
                            className="w-12 md:w-16 opacity-20"
                            alt="logo"
                          />
                          <span className="text-[10px] md:text-xs text-white/20">
                            No Thumbnail
                          </span>
                        </div>
                      )}

                      {/* 조회수 뱃지 */}
                      <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/70 backdrop-blur px-1.5 md:px-2 py-1 rounded text-[9px] md:text-[10px] text-white/60 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 md:w-3.5 md:h-3.5 text-white"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className="font-medium">{item.views}</span>
                      </div>

                      {/* 카테고리 뱃지 */}
                      <div className="absolute top-2 md:top-3 left-2 md:left-3">
                        <span className="px-2 md:px-3 py-1 bg-black/60 backdrop-blur border border-white/10 text-[8px] md:text-[10px] font-bold text-blue-400 rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-center mb-3 md:mb-4 text-[11px] md:text-[13px] font-medium text-white/40">
                        <span className="flex items-center gap-1.5">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full" />{' '}
                          {formatDate(item.createdAt)}
                        </span>

                        <span className="text-white/70 text-[10px] md:text-xs border border-white/10 px-1.5 md:px-2 py-0.5 rounded">
                          {item.author}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-bold leading-[1.4] text-white/90 group-hover:text-white transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 line-clamp-2 font-light">
                        {item.description}
                      </p>
                    </div>

                    {/* 다운로드 버튼 */}
                    <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 h-10 md:h-12">
                      <a
                        href={getImageUrl(item.pdfUrl) || '#'}
                        onClick={(e) => handleDownload(e, item)}
                        className="flex items-center justify-center w-full h-full gap-2 md:gap-3 text-xs md:text-[13px] font-black tracking-widest uppercase
                                   text-white/60 bg-transparent border border-white/10 rounded-sm
                                   hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] 
                                   hover:border-blue-500/50 hover:text-white
                                   hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(30,58,138,0.4)]
                                   active:scale-[0.97] transition-all duration-500 group/btn cursor-pointer"
                      >
                        Download PDF
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-y-1 transition-transform duration-300"
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
              <div className="w-full h-40 md:h-64 flex flex-col items-center justify-center text-white/20 font-medium border border-white/5 dashed rounded-lg gap-2 text-sm md:text-base">
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
