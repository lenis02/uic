import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="
      fixed top-0 w-full h-[120px] bg-transparent 
       z-50 transition-all duration-500 select-none py-8 ease-in-out
       
      hover:h-96 hover:bg-deep-purple/90
       "
    >
      {/* 로고 영역 */}
      <img
        className="absolute cursor-pointer left-12 top-[16px] size-24 w-auto z-10"
        src={assets.logo_uic}
        alt="UIC 로고"
        onClick={() => navigate('/')}
      />
      <div className="mx-auto px-6 flex justify-between items-center">
        {/* 메뉴 영역 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[60px]
        hidden md:flex items-center gap-12"
        >
          {['ABOUT', 'RESEARCH', 'ARCHIVE', 'NOTICE'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium text-gray-200 hover:text-[#5833aa] transition-colors duration-200 tracking-widest"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
