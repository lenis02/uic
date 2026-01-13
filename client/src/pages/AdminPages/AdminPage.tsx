// src/components/AdminLayout.tsx
import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('관리자 로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    { path: '/admin/greeting', label: '인사말 관리' },
    { path: '/admin/history', label: '연혁 관리' },
    { path: '/admin/members', label: '멤버 관리' },
    { path: '/admin/research', label: '리서치 관리' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    // [수정 포인트]
    // 1. mt-32 유지 (NavBar 공간 확보)
    // 2. h-[calc(100vh-8rem)] : 전체 화면(100vh)에서 mt-32(8rem) 만큼 뺀 높이를 설정
    // 3. overflow-hidden : 부모 컨테이너는 스크롤바를 숨김
    <div className="flex mt-32 h-[calc(100vh-8rem)] w-full bg-slate-950 overflow-hidden">
      {/* 사이드바 */}
      <nav className="w-64 flex flex-col justify-between bg-black/20 backdrop-blur-xl border-r border-white/5 p-6 h-full flex-shrink-0 z-10">
        <div>
          <div className="mb-12 px-2 mt-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white/70">
              UIC ADMIN
            </h2>
            <p className="text-sm text-gray-300 mt-2 font-light tracking-wider opacity-80">
              Management System
            </p>
          </div>

          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-5 py-3.5 rounded-xl font-medium transition-all duration-300 ease-in-out border border-transparent ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 text-white shadow-lg shadow-blue-900/30 transform scale-[1.02]'
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] hover:border-blue-500/30 hover:shadow-md'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-6 border-t border-white/10 mb-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red cursor-pointer group relative overflow-hidden rounded-xl px-4 py-3 text-gray-300 transition-all hover:text-white"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#001a4d] via-[#003399] to-[#001a4d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              <span className="font-medium">로그아웃</span>
            </div>
          </button>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      {/* [수정 포인트] overflow-y-auto를 여기에 주어 내부에서만 스크롤 되도록 함 */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-950 relative custom-scroll scrollbar-hide">
        <div className="max-w-7xl mx-auto p-10 pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
