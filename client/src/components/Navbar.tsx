import { useLocation, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full min-h-[80px]">
        {/* 1. 왼쪽 로고 */}
        <Link to="/" className="block cursor-pointer shrink-0">
          <img
            src={assets.logo_uic}
            alt="UIC Logo"
            className="w-auto object-contain transition-all select-none duration-300 hover:brightness-125"
          />
        </Link>

        {/* 2. 중앙 메뉴 링크 */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-white/90 select-none text-base md:text-lg font-bold ml-auto">
          {[
            { path: '/about', label: 'About Us' },
            { path: '/members', label: 'Members' },
            { path: '/research', label: 'Research' },
            { path: '/activity', label: 'Activity' },
            { path: '/join', label: 'Join Us' },
            { path: '/contact', label: 'Contact Us' },
          ].map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                className="relative transition-all duration-300 hover:text-white group text-white/70"
              >
                {menu.label}

                {/* 하단 바 그라데이션 (About 페이지 활성 시 전용 색감) */}
                {isActive && (
                  <span
                    className={`absolute -bottom-2 left-0 w-full h-[3px] rounded-full transition-all duration-500
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                          : 'bg-purple-300'
                      }
                    `}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. 모바일 메뉴 버튼 */}
        <div className="lg:hidden text-2xl text-white cursor-pointer">
          <span className="material-icons">menu</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
