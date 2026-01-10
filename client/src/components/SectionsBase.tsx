import { assets } from '../../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

// props 타입 정의 (화살표 표시 여부)
interface SectionsBaseProps {
  showArrow: boolean;
}

const SectionsBase = ({ showArrow }: SectionsBaseProps) => {
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

      {/* 화살표 애니메이션 - AnimatePresence로 부드럽게 제거 */}
      <AnimatePresence>
        {showArrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9, y: [0, 5, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.3 },
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="fixed top-[85%] left-1/2 -translate-x-1/2 pointer-events-none z-20"
          >
            <svg
              className="w-24 h-12 text-white"
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
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionsBase;
