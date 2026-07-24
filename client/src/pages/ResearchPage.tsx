import { useState, useMemo, useEffect, useRef } from 'react';
import { assets } from '../../assets/assets';
import FooterBar from '../components/FooterBar';
import { api } from '../api/api';

// 백엔드 데이터 타입 정의
interface Research {
  id: number;
  title: string;
  category: string;
  year: string;
  pdfUrl: string;
  downloads: number;
  createdAt: string;
}

// ✅ 정렬 옵션
const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '다운로드순', value: 'downloads' },
  { label: '등록순 (오래된 순)', value: 'oldest' },
  { label: '수상 등급순', value: 'awardTier' },
];

/** 대상 → 최우수상 → 우수상 → 수상작 → 기타 (알 수 없는 카테고리는 맨 뒤) */
const AWARD_TIER_ORDER = [
  '대상',
  '최우수상',
  '우수상',
  '장려상',
  '수상작',
  '기타',
] as const;

const awardTierRank = (category: string) => {
  const c = (category || '').trim();
  const idx = AWARD_TIER_ORDER.findIndex((tier) => tier === c);
  return idx === -1 ? AWARD_TIER_ORDER.length : idx;
};

const CATEGORY_FILENAME_MAP: Record<string, string> = {
  대상: 'grand_prize',
  최우수상: 'best_prize',
  우수상: 'excellence_prize',
  장려상: 'encouragement_prize',
  수상작: 'award_winner',
  기타: 'etc',
};

/** 수상 등급별 색상. 대상만 금색으로 띄우고 나머지는 사이트 기조인 파랑 계열로 단계를 준다. */
const AWARD_STYLES: Record<string, { bar: string; badge: string }> = {
  대상: {
    bar: 'from-amber-300/90 to-amber-500/20',
    badge: 'text-amber-200 bg-amber-400/15 border-amber-400/30',
  },
  최우수상: {
    bar: 'from-sky-300/90 to-sky-500/20',
    badge: 'text-sky-200 bg-sky-400/15 border-sky-400/30',
  },
  우수상: {
    bar: 'from-blue-400/90 to-blue-600/20',
    badge: 'text-blue-200 bg-blue-500/15 border-blue-500/30',
  },
  장려상: {
    bar: 'from-indigo-400/90 to-indigo-600/20',
    badge: 'text-indigo-200 bg-indigo-500/15 border-indigo-500/30',
  },
};

const DEFAULT_AWARD_STYLE = {
  bar: 'from-white/40 to-white/10',
  badge: 'text-white/60 bg-white/10 border-white/20',
};

const awardStyle = (category: string) =>
  AWARD_STYLES[(category || '').trim()] ?? DEFAULT_AWARD_STYLE;

const sanitizeFilePart = (value: string) =>
  value
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .trim()
    .replace(/\s+/g, '_');

const ResearchPage = () => {
  const [reports, setReports] = useState<Research[]>([]);
  const [activeYear, setActiveYear] = useState('');
  const [sortBy, setSortBy] = useState('awardTier');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLElement>(null);

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

  // 💡 수정 1: 연도 목록 추출 로직을 'createdAt'에서 'year'로 변경
  const years = useMemo(() => {
    if (reports.length === 0) return [];

    const uniqueYears = Array.from(
      new Set(reports.map((item) => item.year).filter(Boolean)),
    );

    return uniqueYears.sort((a, b) => Number(b) - Number(a));
  }, [reports]);

  /** 전체 탭 제거: 선택 없으면 가장 최근 연도를 기본으로 사용 */
  const selectedYear = useMemo(() => {
    if (!years.length) return '';
    if (activeYear && years.includes(activeYear)) return activeYear;
    return years[0];
  }, [years, activeYear]);

  // 2. ✨ 필터링 및 정렬 로직
  const processedReports = useMemo(() => {
    let result = [...reports];

    // (1) 검색어 필터
    if (searchTerm) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedYear) {
      result = result.filter((item) => item.year === selectedYear);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortBy === 'latest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'awardTier') {
        const tierDiff = awardTierRank(a.category) - awardTierRank(b.category);
        if (tierDiff !== 0) return tierDiff;
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [reports, selectedYear, sortBy, searchTerm]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top:0, behavior: 'auto'})
    }
  })

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
      prev.map((r) =>
        r.id === item.id ? { ...r, downloads: r.downloads + 1 } : r,
      ),
    );

    // 3. {year}_{category}_report 형식 파일명 생성
    const safeYear = sanitizeFilePart(item.year || '') || 'unknown';
    const mappedCategory = CATEGORY_FILENAME_MAP[(item.category || '').trim()];
    const safeCategory = sanitizeFilePart(mappedCategory || 'etc');
    const attachmentName = `${safeYear}_${safeCategory}_report`;

    // 4. 파일명 커스터마이징
    let downloadUrl = originalUrl;

    if (originalUrl.includes('/upload/')) {
      const encodedAttachmentName = encodeURIComponent(attachmentName);
      downloadUrl = originalUrl.replace(
        '/upload/',
        `/upload/fl_attachment:${encodedAttachmentName}/`,
      );
    }

    // 5. 다운로드 실행
    try {
      window.location.assign(downloadUrl);
    } catch (error) {
      console.error('다운로드 시작 실패:', error);
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
    <main className="relative w-full h-screen overflow-hidden bg-[#050505] text-white pt-20 md:pt-28 pb-4 md:pb-6">
      <img
        src={assets.bg_research}
        alt="배경"
        className="fixed inset-0 z-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <div className="relative mt-4 z-10 max-w-[1400px] mx-auto px-4 md:px-6 h-full flex flex-col">
        <div className="flex flex-col w-full h-full bg-black/40 backdrop-blur-xl p-4 md:p-6 lg:p-8 overflow-hidden border border-white/5 shadow-2xl rounded-lg md:rounded-sm">
          {/* [상단 영역] 타이틀 & 검색바 */}
          <header className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0">
            <div className="w-fit shrink-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white/80">
                투자 콘서트 수상작
              </h1>
              <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent mt-1.5" />
            </div>

            <div className="relative w-full md:w-[280px] group shrink-0">
              <input
                type="text"
                placeholder="Search Reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-2 pl-4 pr-10 text-xs md:text-sm text-white/70 focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-300 rounded"
              />
              <svg
                className="absolute right-3 top-2.5 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors"
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
          <div className="mb-4 border-b border-white/5 flex items-center justify-between gap-3 pb-3 shrink-0">
            {/* 연도 탭 가로 스크롤 허용 */}
            <nav className="uic-fade-right flex flex-row gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide min-w-0 pr-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-3 md:px-4 py-1.5 cursor-pointer rounded-md border text-xs md:text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
                    selectedYear === year
                      ? 'bg-blue-500/15 text-white border-blue-500/50'
                      : 'text-white/40 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {year}
                </button>
              ))}
            </nav>

            {/* 정렬 드롭다운 */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/60 border border-white/10 text-white/70 text-[10px] md:text-xs font-medium rounded pl-3 pr-8 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none tracking-wide"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
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
          <section 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar scrollbar-hide">
            {processedReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6 w-full">
                {processedReports.map((item) => {
                  const style = awardStyle(item.category);

                  return (
                    <article
                      key={item.id}
                      className="group relative flex items-start gap-3 overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm pl-5 pr-3 py-3 hover:border-blue-500/35 hover:bg-[#0c0c0c] transition-colors duration-200 shadow-md"
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.bar}`}
                        aria-hidden
                      />

                      <div className="min-w-0 flex-1">
                        {/* 메타: 한 줄로 압축 */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5 text-[10px] md:text-[11px] text-white/45">
                          <span
                            className={`px-2 py-0.5 rounded border font-bold ${style.badge}`}
                          >
                            {item.category}
                          </span>
                          <span>{item.year}</span>
                          <span className="text-white/20">·</span>
                          <span className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-3 h-3"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {item.downloads}
                          </span>
                          <span className="text-white/20">·</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>

                        <h3 className="text-sm md:text-[15px] font-bold leading-snug text-white/95 group-hover:text-white transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </div>

                      <a
                        href={getImageUrl(item.pdfUrl) || '#'}
                        onClick={(e) => handleDownload(e, item)}
                        title="PDF 다운로드"
                        className="shrink-0 self-center inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] md:text-xs font-bold uppercase text-white/60 border border-white/20 transition-colors hover:bg-blue-600/80 hover:border-blue-500/60 hover:text-white"
                      >
                        <svg
                          className="w-3 h-3 md:w-3.5 md:h-3.5"
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
                        PDF
                      </a>
                    </article>
                  );
                })}
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
