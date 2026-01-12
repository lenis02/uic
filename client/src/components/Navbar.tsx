import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isAboutPage = location.pathname === '/about';

  useEffect(() => {
    if (isAboutPage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAboutPage]);

  const isWhiteTheme = isAboutPage || isScrolled;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${
        isWhiteTheme
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      {/* max-w-7xl 유지, flex items-center로 자식 요소들 정렬 */}
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full min-h-[80px]">
        {/* 1. 왼쪽 로고 (Flex Item) */}
        {/* z-index 불필요, absolute 제거로 인해 자연스럽게 배치됨 */}
        <Link to="/" className="block cursor-pointer shrink-0">
          <img
            src={isWhiteTheme ? assets.logo_uic_color : assets.logo_uic}
            alt="UIC Logo"
            className={`object-contain transition-all select-none duration-300 ${
              isWhiteTheme ? 'h-16 md:h-20 w-auto' : 'h-20 md:h-24 w-auto'
            }`}
          />
        </Link>

        {/* 2. 중앙 메뉴 링크 (Flex Item) */}
        {/* [변경점]
            - absolute left-1/2 제거: 로고와 겹침 방지
            - hidden lg:flex: 공간이 좁은 모바일/태블릿에서는 숨김 (겹침 방지)
            - ml-auto (또는 justify-center): 로고 옆 안전한 공간에 배치
        */}
        <div
          className={`hidden lg:flex items-center gap-8 xl:gap-12 transition-colors duration-300
            ${isWhiteTheme ? 'text-gray-800' : 'text-white/90'}            
            whitespace-nowrap select-none text-base font-bold ml-auto
          `}
        >
          <Link
            to="/about"
            className={`hover:text-cyan-600 transition-colors ${
              location.pathname === '/about' ? 'text-cyan-600 font-bold' : ''
            }`}
          >
            About Us
          </Link>

          <Link to="/members" className="hover:text-cyan-600 transition-colors">
            Members
          </Link>

          <Link
            to="/research"
            className="hover:text-cyan-600 transition-colors"
          >
            Research
          </Link>

          <Link
            to="/activity"
            className="hover:text-cyan-600 transition-colors"
          >
            Activity
          </Link>

          <Link to="/join" className="hover:text-cyan-600 transition-colors">
            Join Us
          </Link>

          <Link to="/contact" className="hover:text-cyan-600 transition-colors">
            Contact Us
          </Link>
        </div>

        {/* (옵션) 모바일 메뉴 버튼이 들어갈 자리 */}
        <div className="lg:hidden text-2xl cursor-pointer">
          {/* <GiHamburgerMenu /> 같은 아이콘 추가 필요 */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
