import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/about', label: 'About Us' },
    { path: '/members', label: 'Members' },
    { path: '/research', label: 'Research' },
    { path: '/activity', label: 'Activity' },
    { path: '/join', label: 'Join Us' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-transparent px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full min-h-[80px]">
        {/* 1. 로고 */}
        <Link
          to="/"
          className="block cursor-pointer shrink-0 z-[110]"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={assets.logo_uic}
            alt="UIC Logo"
            className="w-60 -mt-4 aspect-[5/3] transition-all select-none duration-300 hover:brightness-125"
          />
        </Link>

        {/* 2. 데스크탑 메뉴 (기존 유지) */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-white/90 select-none text-base md:text-lg font-bold ml-auto">
          {menuItems.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className="relative transition-all duration-300 hover:text-white group text-white/70"
              >
                {menu.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. 모바일 햄버거 버튼 (SVG 애니메이션 포함) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden cursor-pointer flex flex-col justify-center items-center w-12 h-12 relative z-[110] focus:outline-none bg-white/5 border border-white/10 rounded-xl"
        >
          <div className="w-6 h-4 flex flex-col justify-between relative">
            <span
              className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'w-3/4'
              }`}
            />
            <span
              className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </div>
        </button>

        {/* 4. 모바일 사이드 메뉴 (오른쪽 슬라이드) */}
        <div
          className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-black/90 backdrop-blur-2xl border-l border-white/10 z-[100] transform transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col pt-32 px-10 gap-8">
            {menuItems.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  onClick={() => setIsOpen(false)}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={`text-2xl font-black tracking-widest uppercase transition-all duration-500 ${
                    isOpen
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-20 opacity-0'
                  } ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4 group">
                    <span
                      className={`w-1 h-6 bg-blue-500 transition-all duration-300 ${
                        isActive
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-50'
                      }`}
                    />
                    {menu.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 배경 오버레이 (메뉴 열렸을 때 바탕 클릭 시 닫기) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
