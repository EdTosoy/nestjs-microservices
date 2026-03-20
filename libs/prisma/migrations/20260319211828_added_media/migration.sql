-- CreateTable
CREATE TABLE "Media" (
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadByUserId" TEXT,
    "productId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("publicId")
);
