CREATE TABLE IF NOT EXISTS advertisement (
  id SERIAL PRIMARY KEY,
  placement VARCHAR NOT NULL,
  "imageUrl" VARCHAR NOT NULL,
  "linkUrl" VARCHAR,
  "altText" VARCHAR NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_placement (
  id SERIAL PRIMARY KEY,
  placement VARCHAR NOT NULL UNIQUE,
  "barHeight" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 위치별 기본 띠 높이. 핸드오프 규격(상단 58 / 하단 66)을 그대로 쓴다.
INSERT INTO ad_placement (placement, "barHeight")
VALUES ('top', 58), ('bottom', 66)
ON CONFLICT (placement) DO NOTHING;
