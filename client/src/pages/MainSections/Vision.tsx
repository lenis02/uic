import { motion, type Variants } from 'framer-motion';

const Vision = () => {
  // 선 애니메이션 (데스크탑용)
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: 'easeInOut', delay: 0.3 },
    },
  };

  // 텍스트 애니메이션 (공통)
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.5 },
    },
  };

  // --- 데스크탑용 고정 좌표 설정 ---
  const centerX = 0;
  const centerY = 300;

  const solidRadius = 200;
  const dashedRadius = 230;

  const startX_Diagonal = solidRadius * 0.707;
  const startY_Diagonal = solidRadius * 0.707;

  const kinkX = 350;
  const finalX = 450;

  const topTargetY = 80;
  const midTargetY = 300;
  const botTargetY = 520;

  // 비전 데이터 (모바일 매핑용)
  const visionData = [
    {
      title: 'Development',
      color: 'text-purple-300',
      desc: '기업 및 기관들과의 제휴를 통해\n지속가능한 발전의 기회 제공',
    },
    {
      title: 'Platform',
      color: 'text-blue-300',
      desc: '취업/진로에 도움될\n다양한 분야의 경험 제공',
    },
    {
      title: 'Synergy',
      color: 'text-pink-300',
      desc: '대학생들간의 네트워킹을\n기반으로 상호 교류',
    },
  ];

  return (
    <section
      id="vision"
      className="min-h-screen w-full pt-20 md:pt-32 bg-black/40 flex flex-col items-center justify-center snap-start relative overflow-hidden px-6"
    >
      <div className="relative z-10 text-center mb-10 md:mb-16 select-none">
        <h1 className="text-3xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          OUR VISION
        </h1>
      </div>

      {/* =========================================
          [1] 모바일 레이아웃 (세로형 리스트) - md 미만 표시
          ========================================= */}
      <div className="flex md:hidden flex-col gap-10 w-full max-w-sm mx-auto z-10">
        {visionData.map((item, index) => (
          <motion.div
            key={item.title}
            className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.2 }} // 순차적으로 나타남
          >
            <h3 className={`text-3xl font-bold mb-3 ${item.color}`}>
              {item.title}
            </h3>
            <p className="text-gray-300 text-sm font-light whitespace-pre-line">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* =========================================
          [2] 데스크탑 레이아웃 (기존 SVG) - md 이상 표시
          ========================================= */}
      <div className="hidden md:block relative w-[900px] h-[600px] mx-auto scale-75 lg:scale-100 transform-origin-top">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <clipPath id="cut-left-half">
              <rect x={centerX} y="0" width="100%" height="100%" />
            </clipPath>
          </defs>

          {/* === 원 그리기 === */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={solidRadius}
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            clipPath="url(#cut-left-half)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 1 } }}
            viewport={{ once: true }}
          />
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={dashedRadius}
            stroke="white"
            strokeWidth="1"
            fill="transparent"
            opacity="0.3"
            strokeDasharray="10 15"
            initial={{ rotate: 0, opacity: 0 }}
            whileInView={{
              opacity: 0.3,
              rotate: 360,
              transition: {
                opacity: { duration: 0.5 },
                rotate: { duration: 60, ease: 'linear', repeat: Infinity },
              },
            }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
            viewport={{ once: true }}
          />

          {/* === 선 그리기 === */}
          <motion.path
            d={`M ${centerX + startX_Diagonal} ${centerY - startY_Diagonal} L ${kinkX} ${topTargetY} L ${finalX} ${topTargetY}`}
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
          <motion.path
            d={`M ${centerX + solidRadius} ${centerY} L ${finalX + 150} ${midTargetY}`}
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
          <motion.path
            d={`M ${centerX + startX_Diagonal} ${centerY + startY_Diagonal} L ${kinkX} ${botTargetY} L ${finalX} ${botTargetY}`}
            stroke="white"
            strokeWidth="2"
            fill="transparent"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
        </svg>

        {/* === 텍스트 영역 === */}
        <motion.div
          className="absolute text-white w-[300px]"
          style={{ left: `${finalX + 30}px`, top: `${topTargetY}px` }}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: 'easeOut', delay: 1.8 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="-translate-y-1/2">
            <h3 className="text-5xl font-bold text-center text-purple-300">
              Development
            </h3>
            <p className="text-gray-300 text-sm text-center mt-2 font-light">
              기업 및 기관들과의 제휴를 통해
              <br />
              지속가능한 발전의 기회 제공
            </p>
          </div>
        </motion.div>

        <motion.div
          className="absolute text-white w-[300px]"
          style={{ left: `${finalX + 180}px`, top: `${midTargetY}px` }}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: 'easeOut', delay: 1.8 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="-translate-y-1/2">
            <h3 className="text-5xl font-bold text-center text-blue-300">
              Platform
            </h3>
            <p className="text-gray-300 text-center text-sm mt-2 font-light">
              취업/진로에 도움될
              <br />
              다양한 분야의 경험 제공
            </p>
          </div>
        </motion.div>

        <motion.div
          className="absolute text-white w-[300px]"
          style={{ left: `${finalX + 30}px`, top: `${botTargetY}px` }}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: 'easeOut', delay: 1.8 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="-translate-y-1/2">
            <h3 className="text-5xl font-bold text-center text-pink-300">
              Synergy
            </h3>
            <p className="text-gray-300 text-sm text-center mt-2 font-light">
              대학생들간의 네트워킹을
              <br />
              기반으로 상호 교류
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Vision;
