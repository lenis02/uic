import { assets } from '../../assets/assets';
import { motion } from 'framer-motion';

const SectionsBase = () => {
  return (
    <>
      {/* [배경 이미지 레이어] */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <img
          src={assets.bg_main}
          alt="배경"
          className="w-full h-full object-cover object-center opacity-70"
        />
      </div>
      {/* 화살표 애니메이션 */}
      <div className="fixed top-[85%] left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            className="w-24 h-12 text-white opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>
    </>
  );
};

export default SectionsBase;
