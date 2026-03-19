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
    // 💡 px-4 md:px-8 xl:px-12 로 화면이 줄어들 때 좌우 여백을 유동적으로 조절
    <nav className="fixed top-0 w-full z-[100] bg-transparent px-4 md:px-8 xl:px-12 py-4">
      <div className="max-w-[1680px] mx-auto flex items-center justify-between h-full min-h-[60px] md:min-h-[80px] pt-2 md:pt-4">
        
        {/* 1. 로고 */}
        <Link
          to="/"
          className="flex flex-col items-center block cursor-pointer shrink-0 z-[110] mt-2 md:mt-4"
          onClick={() => setIsOpen(false)}
        >
          {/* 💡 화면 크기에 따라 로고 크기를 유동적으로 조절 (clamp 사용) */}
          <img
            src={assets.logo_uic}
            alt="UIC Logo"
            className="w-[clamp(5rem,10vw,10rem)] aspect-[5/3] transition-all select-none duration-300 hover:brightness-125 ml-2 md:ml-4"
          />
        </Link>

        {/* 2. 데스크탑 메뉴 */}
        {/* 💡 gap 값을 clamp로 주어 화면이 줄어들면 메뉴 사이 간격도 자연스럽게 줄어들게 설정 */}
        <div className="hidden lg:flex items-center gap-[clamp(1rem,2vw,3rem)] text-white/90 select-none font-bold ml-auto">
          {menuItems.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                // 💡 폰트 크기도 화면에 비례해서 줄어들게 설정 (최소 14px, 최대 18px)
                className="relative text-[clamp(0.875rem,1.2vw,1.125rem)] transition-all duration-300 hover:text-white group text-white/70 whitespace-nowrap"
              >
                {menu.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. 모바일 햄버거 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden cursor-pointer flex flex-col justify-center items-center w-10 h-10 md:w-12 md:h-12 relative z-[110] focus:outline-none bg-white/5 border border-white/10 rounded-xl"
        >
          <div className="w-5 h-3.5 md:w-6 md:h-4 flex flex-col justify-between relative">
            <span
              className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-[6px] md:translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'w-3/4'
              }`}
            />
            <span
              className={`w-full h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-[6px] md:-translate-y-[7px]' : ''
              }`}
            />
          </div>
        </button>

        {/* 4. 모바일 사이드 메뉴 (오른쪽 슬라이드) */}
        <div
          className={`fixed inset-y-0 right-0 w-[80%] md:w-[400px] bg-black/90 backdrop-blur-2xl border-l border-white/10 z-[100] transform transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col pt-28 md:pt-32 px-8 md:px-10 gap-6 md:gap-8">
            {menuItems.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  onClick={() => setIsOpen(false)}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  className={`text-xl md:text-2xl font-black tracking-widest uppercase transition-all duration-500 ${
                    isOpen
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-20 opacity-0'
                  } ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4 group">
                    <span
                      className={`w-1 h-5 md:h-6 bg-blue-500 transition-all duration-300 ${
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