-- CreateTable
CREATE TABLE "post_likes" (
    "post_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "post_like_visitors" (
    "post_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "post_like_visitors_pkey" PRIMARY KEY ("post_id","visitor_id")
);

-- CreateIndex
CREATE INDEX "idx_visitor_fingerprint" ON "post_like_visitors"("post_id", "fingerprint");
