import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { getToken, removeToken } from '../../api/auth';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert('관리자 로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 라우트 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const menuGroups = [
    {
      title: '메인 페이지 관리',
      items: [
        { path: '/admin/popup', label: '팝업 관리' },
        { path: '/admin/network', label: '참여 대학 관리' },
        { path: '/admin/partner', label: '협력사 관리' },
        { path: '/admin/advertisement', label: '광고 배너 관리' },
      ],
    },
    {
      title: 'About Us 관리',
      items: [
        { path: '/admin/greeting', label: '인사말 관리' },
        { path: '/admin/history', label: '연혁 관리' },
      ],
    },
    {
      title: '멤버 페이지 관리',
      items: [{ path: '/admin/members', label: '멤버 목록 관리' }],
    },
    {
      title: '리서치 페이지 관리',
      items: [{ path: '/admin/research', label: '리서치 데이터 관리' }],
    },
    {
      title: '활동 페이지 관리',
      items: [{ path: '/admin/activity', label: '활동 목록 관리' }],
    },
    {
      title: '지원 페이지 관리',
      items: [{ path: '/admin/joinus', label: '지원 안내 관리' }],
    },
  ];

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const NavItem = ({ item }: { item: { path: string; label: string } }) => {
    const isActive = location.pathname === item.path;
    return (
      <li>
        <Link
          to={item.path}
          className={`block px-4 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-300 ease-in-out border border-transparent ${
            isActive
              ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow-lg shadow-blue-900/30 scale-[1.02]'
              : 'text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] hover:border-blue-500/30 hover:shadow-md'
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  const NavContent = () => (
    <>
      <div className="mb-6 px-2 mt-2">
        <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-white/70">
          UIC ADMIN
        </h2>
        <p className="text-xs text-gray-300 mt-1 font-light tracking-wider opacity-80">
          Management System
        </p>
      </div>

      <div className="space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-gray-500">
              {group.title}
            </h3>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">

      {/* ── 모바일 상단 바 ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
        <span className="text-white font-extrabold tracking-tight text-lg">UIC ADMIN</span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="메뉴"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── 모바일 드로어 백드롭 ── */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── 사이드바 ── */}
      {/* 모바일: fixed 드로어, 데스크톱: static */}
      <nav className={`
        fixed lg:static top-0 left-0 h-full z-30
        w-64 flex flex-col justify-between
        bg-black/30 backdrop-blur-xl border-r border-white/5 p-6
        transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex-shrink-0
      `}>
        <div>
          <NavContent />
        </div>
        <div className="pt-6 border-t border-white/10 mb-4">
          <button
            onClick={handleLogout}
            className="w-full cursor-pointer group relative overflow-hidden rounded-xl px-4 py-3 text-gray-300 transition-all hover:text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#001a4d] via-[#003399] to-[#001a4d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              <span className="font-medium">로그아웃</span>
            </div>
          </button>
        </div>
      </nav>

      {/* ── 메인 콘텐츠 ── */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-slate-950 relative custom-scroll">
        {/* 모바일 상단 바 높이만큼 padding */}
        <div className="pt-14 lg:pt-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 pb-32">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
