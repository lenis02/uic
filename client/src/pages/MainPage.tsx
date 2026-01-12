import { useState } from 'react';
import MainSidebar from '../components/MainSidebar.tsx';
import SectionsBase from '../components/SectionsBase.tsx';
import Vision from './MainSections/Vision.tsx';
import UICNetwork from './MainSections/UICNetwork.tsx';

const MainPage = () => {
  const [showArrow, setShowArrow] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // 마지막 섹션 근처인지 확인 (바닥에서 50px 여유)
    const isAtBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 50;
    setShowArrow(!isAtBottom);
  };

  return (
    /* 최상위 컨테이너: 배경색을 설정하고 스냅 적용 */
    <div
      id="main-container"
      onScroll={handleScroll} // 스크롤 이벤트 연결
      className="relative font-pre h-screen w-full overflow-y-auto snap-y snap-mandatory bg-uic-dark scroll-smooth scrollbar-hide"
    >
      <MainSidebar />

      <SectionsBase showArrow={showArrow} />

      {/* [SECTION 1] 메인 타이틀 */}
      <section
        id="home"
        className="relative h-screen w-full snap-start flex items-center justify-center z-10"
      >
        <div className="text-center px-4 select-none">
          <h1 className="text-[48px] font-bold text-white leading-none m-0">
            대한민국 금융의 미래
          </h1>
          <p className="text-[28px] mt-6 text-white font-light leading-none">
            전국 대학생 투자동아리 연합회 - UIC
          </p>
        </div>
      </section>

      {/* [SECTION 2] UIC 비전 */}
      <Vision />

      {/* [SECTION 3] UIC 연결 대학 */}
      <UICNetwork />
    </div>
  );
};

export default MainPage;
