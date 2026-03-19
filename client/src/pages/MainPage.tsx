import { useState } from 'react';
import MainSidebar from '../components/MainSidebar.tsx';
import SectionsBase from '../components/SectionsBase.tsx';
import Vision from './MainSections/Vision.tsx';
import UICNetwork from './MainSections/UICNetwork.tsx';
import UICPartner from './MainSections/UICPartner.tsx';

const MainPage = () => {
  const [showArrow, setShowArrow] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 50;
    setShowArrow(!isAtBottom);
  };

  return (
    <div
      id="main-container"
      onScroll={handleScroll}
      // 💡 수정: 모바일에서는 스냅 해제, md(태블릿) 이상에서만 snap 활성화
      className="relative font-pre h-screen w-full overflow-y-auto md:snap-y md:snap-mandatory bg-uic-dark scroll-smooth custom-scrollbar scrollbar-hide"
    >
      <MainSidebar />
      <SectionsBase showArrow={showArrow} />

      <section
        id="home"
        // 💡 수정: md 이상에서만 snap-start 적용
        className="relative h-screen w-full md:snap-start flex items-center justify-center z-10"
      >
        <div className="text-center px-4 select-none">
          <h1 className="text-[28px] md:text-[40px] font-bold text-white leading-none m-0">
            대한민국 금융의 미래
          </h1>
          <p className="text-[16px] md:text-[20px] mt-6 text-white font-light leading-none">
            전국 대학생 투자동아리 연합회 - UIC
          </p>
        </div>
      </section>

      <Vision />
      <UICNetwork />
      <UICPartner />
    </div>
  );
};

export default MainPage;