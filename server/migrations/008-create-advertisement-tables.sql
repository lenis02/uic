-- 광고 배치 모델.
-- type = anchored(위치 고정형: 섹션 + 위/아래) 또는 floating(추적형: 좌/우 여백)
-- 크기는 광고마다 가로·세로 px로 들고 있는다.
CREATE TABLE IF NOT EXISTS advertisement (
  id SERIAL PRIMARY KEY,
  type VARCHAR NOT NULL,
  section VARCHAR,
  edge VARCHAR,
  side VARCHAR,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  "imageUrl" VARCHAR NOT NULL,
  "linkUrl" VARCHAR,
  "altText" VARCHAR NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
