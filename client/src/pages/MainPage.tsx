import { assets } from '../../assets/assets.ts';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SectionsBase from '../components/SectionsBase.tsx';
import Vision from './MainSections/Vision.tsx';
import UICNetwork from './MainSections/UICNetwork.tsx';
import JoinUs from './MainSections/JoinUs.tsx';

const MainPage = () => {
  return (
    /* 최상위 컨테이너: 배경색을 설정하고 스냅 적용 */
    <div className="relative font-pre h-screen w-full overflow-y-auto snap-y snap-mandatory bg-uic-dark scroll-smooth scrollbar-hide">
      <Navbar />

      <SectionsBase />

      {/* [SECTION 1] 메인 타이틀 */}
      <section className="relative h-screen w-full snap-start flex items-center justify-center z-10">
        <div className="text-center px-4 select-none">
          <h1 className="text-[48px] font-bold text-white leading-none m-0">
            대한민국의 금융의 미래
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

      {/* [SECTION 4] UIC 지원하기 */}
      <JoinUs />
    </div>
  );
};

export default MainPage;
