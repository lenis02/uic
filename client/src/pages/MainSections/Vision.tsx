import { motion, type Variants } from 'framer-motion';

const Vision = () => {
  // 선 애니메이션
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: 'easeInOut', delay: 0.3 },
    },
  };

  // 텍스트 애니메이션
  const textVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 1.8 },
    },
  };

  // --- 좌표 설정 ---
  const centerX = 0;
  const centerY = 300;

  const solidRadius = 200;
  const dashedRadius = 230;

  const startX_Diagonal = solidRadius * 0.707;
  const startY_Diagonal = solidRadius * 0.707;

  const kinkX = 350;
  const finalX = 450;

  // 각 선의 Y 좌표
  const topTargetY = 80;
  const midTargetY = 300;
  const botTargetY = 520;

  return (
    <>
      {/* 배경을 살짝 어둡게 하려면 bg-black/40 유지, 완전히 투명하려면 bg-transparent */}
      <section 
        id='vision'
        className="h-screen w-full pt-32 bg-black/40 flex-col items-center justify-center snap-start relative overflow-hidden">
        {/* [중앙 정렬 핵심 수정]
          1. w-[900px]: 내용물이 들어갈 충분한 너비 지정 (선+텍스트 포함)
          2. mx-auto: 이 박스를 화면 가로 중앙에 배치
          3. 기존 container 클래스 제거 (container는 반응형이라 너비가 계속 변해서 좌표 고정형 SVG에 불리함)
        */}
        <div className="relative z-10 text-center mb-16 select-none">
          <h1 className="text-3xl md:text-6xl mt-4 font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            OUR VISION
          </h1>
        </div>
        <div className="relative w-[900px] h-[600px] mx-auto">
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
            />

            {/* === 선 그리기 === */}

            {/* 1. 상단 선 */}
            <motion.path
              d={`M ${centerX + startX_Diagonal} ${centerY - startY_Diagonal} 
              L ${kinkX} ${topTargetY} 
              L ${finalX} ${topTargetY}`}
              stroke="white"
              strokeWidth="2"
              fill="transparent"
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
            />

            {/* 2. 중앙 선 (중앙선 길이를 조금 더 늘려서 텍스트 위치 확보) */}
            <motion.path
              d={`M ${centerX + solidRadius} ${centerY} 
                L ${finalX + 150} ${midTargetY}`}
              stroke="white"
              strokeWidth="2"
              fill="transparent"
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
            />

            {/* 3. 하단 선 */}
            <motion.path
              d={`M ${centerX + startX_Diagonal} ${centerY + startY_Diagonal} 
                L ${kinkX} ${botTargetY} 
                L ${finalX} ${botTargetY}`}
              stroke="white"
              strokeWidth="2"
              fill="transparent"
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
            />
          </svg>

          {/* === 텍스트 영역 === */}

          {/* 1. 상단 텍스트 */}
          <motion.div
            className="absolute text-white w-[300px]" // 줄바꿈 방지용 너비 추가
            style={{ left: `${finalX + 30}px`, top: `${topTargetY}px` }}
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
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

          {/* 2. 중앙 텍스트 */}
          <motion.div
            className="absolute text-white w-[300px]"
            style={{ left: `${finalX + 180}px`, top: `${midTargetY}px` }}
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
          >
            <div className="-translate-y-1/2">
              <h3 className="text-5xl font-bold text-center text-blue-300">Platform</h3>
              <p className="text-gray-300 text-center text-sm mt-2 font-light">
                취업/진로에 도움될
                <br />
                다양한 분야의 경험 제공
              </p>
            </div>
          </motion.div>

          {/* 3. 하단 텍스트 */}
          <motion.div
            className="absolute text-white w-[300px]"
            style={{ left: `${finalX + 30}px`, top: `${botTargetY}px` }}
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
          >
            <div className="-translate-y-1/2">
              <h3 className="text-5xl font-bold text-center text-pink-300">Synergy</h3>
              <p className="text-gray-300 text-sm text-center mt-2 font-light">
                대학생들간의 네트워킹을
                <br />
                기반으로 상호 교류
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Vision;
