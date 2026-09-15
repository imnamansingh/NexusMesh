-- CreateTable
CREATE TABLE "sessions" (
    "sessionId" TEXT NOT NULL,
    "sessionStartTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionEndTime" TIMESTAMP(3),
    "totalSessionTime" INTEGER,
    "totalCost" DECIMAL(18,8),
    "totalBandwidthUsed" BIGINT,
    "userLat" DOUBLE PRECISION,
    "userLon" DOUBLE PRECISION,
    "nodeLat" DOUBLE PRECISION,
    "nodeLon" DOUBLE PRECISION,
    "userWalletAddress" TEXT NOT NULL,
    "nodeWalletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sessionId")
);

-- CreateIndex
CREATE INDEX "sessions_userWalletAddress_idx" ON "sessions"("userWalletAddress");
