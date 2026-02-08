import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'vision', label: 'Vision' },
  { id: 'network', label: 'Network' },
  { id: 'partner', label: 'Partner' },
];

const Sidebar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');

  // 1. '/' 경로가 아니면 렌더링하지 않음
  if (location.pathname !== '/') return null;

  // 2. 현재 어떤 섹션이 화면에 보이는지 감지 (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // 50% 이상 보일 때 감지
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // 3. 클릭 시 해당 섹션으로 이동하는 함수
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    // 스냅 스크롤 컨테이너를 찾음
    const container = document.getElementById('main-container');

    if (element && container) {
      // 컨테이너 내부에서 해당 요소의 위치로 스크롤
      container.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6">
      {sections.map(({ id, label }) => (
        <div key={id} className="relative flex items-center group">
          {/* 라벨 (호버 시에만 등장) */}
          <span
            className={`
        absolute whitespace-nowrap left-8 px-2 py-1 rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-300
        opacity-0 -translate-x-2
        group-hover:opacity-100 group-hover:translate-x-0
        ${
          activeSection === id
            ? 'text-white bg-purple-800/80' // 활성화됐을 때의 색상
            : 'text-gray-400' // 비활성화됐을 때의 색상
        }
      `}
          >
            {label}
          </span>

          {/* 점 (인디케이터) */}
          <button
            onClick={() => scrollToSection(id)}
            className={`
              relative w-5 h-5 rounded-full transition-all duration-300 cursor-pointer
              ${
                activeSection === id
                  ? 'bg-purple-800 scale-125'
                  : 'bg-white/20 hover:bg-white/50'
              }
            `}
          >
            {/* 활성화 시 퍼지는 효과 (Pulse) */}
            {activeSection === id && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 rounded-full bg-purple-400 blur-sm"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        </div>
      ))}

      {/* 세로 선 장식 */}
      <div className="absolute left-[9px] top-0 bottom-0 w-[1px] bg-white/10 -z-10 rounded-full" />
    </nav>
  );
};

export default Sidebar;
