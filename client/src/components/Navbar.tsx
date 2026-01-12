import { useLocation, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent px-6 py-4">
      {/* 내비게이션 전체에 배경색을 넣고 싶으시면 
        bg-transparent 대신 bg-[#1a1a1a] 혹은 bg-purple-900/80 등을 넣으시면 됩니다.
      */}
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full min-h-[80px]">
        {/* 1. 왼쪽 로고 (흰색 버전 사용) */}
        <Link to="/" className="block cursor-pointer shrink-0">
          <img
            src={assets.logo_uic} // 컬러 로고 대신 흰색 로고 사용
            alt="UIC Logo"
            className="w-auto object-contain transition-all select-none duration-300"
          />
        </Link>

        {/* 2. 중앙 메뉴 링크 (텍스트 흰색 고정) */}
        <div
          className="hidden lg:flex items-center gap-8 xl:gap-12 transition-colors duration-300
            text-white/90 whitespace-nowrap select-none text-base md:text-lg font-bold ml-auto
          "
        >
          <Link
            to="/about"
            className={`hover:text-purple-300 transition-colors ${
              location.pathname === '/about'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-300'
                : ''
            }`}
          >
            About Us
          </Link>

          <Link
            to="/members"
            className={`hover:text-purple-300 transition-colors ${
              location.pathname === '/members'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-300'
                : ''
            }`}
          >
            Members
          </Link>

          <Link
            to="/research"
            className={`hover:text-purple-300 transition-colors ${
              location.pathname === '/research'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-300'
                : ''
            }`}
          >
            Research
          </Link>

          <Link
            to="/activity"
            className={`hover:text-purple-300 transition-colors ${
              location.pathname === '/activity'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-300'
                : ''
            }`}
          >
            Activity
          </Link>

          <Link
            to="/join"
            className={`hover:text-purple-300 transition-colors ${
              location.pathname === '/join'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-300'
                : ''
            }`}
          >
            Join Us
          </Link>

          <Link
            to="/contact"
            className={`hover:text-purple-300 transition-colors ${
              location.pathname === '/contact'
                ? 'text-purple-300 font-extrabold border-b-2 border-purple-300'
                : ''
            }`}
          >
            Contact Us
          </Link>
        </div>

        {/* 3. 모바일 메뉴 버튼 (흰색) */}
        <div className="lg:hidden text-2xl text-white cursor-pointer">
          {/* 아이콘 추가 자리 */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
