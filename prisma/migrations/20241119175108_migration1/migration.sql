-- CreateTable
CREATE TABLE "books" (
    "bookId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "publishedYear" INTEGER NOT NULL,
    "totalCopies" INTEGER NOT NULL,
    "availableCopies" INTEGER NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("bookId")
);

-- CreateTable
CREATE TABLE "members" (
    "memberId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "membershipDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("memberId")
);

-- CreateTable
CREATE TABLE "borrowRecords" (
    "borrowId" UUID NOT NULL,
    "borrowDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "bookId" UUID NOT NULL,
    "memberId" UUID NOT NULL,

    CONSTRAINT "borrowRecords_pkey" PRIMARY KEY ("borrowId")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE INDEX "borrowRecords_bookId_idx" ON "borrowRecords"("bookId");

-- CreateIndex
CREATE INDEX "borrowRecords_memberId_idx" ON "borrowRecords"("memberId");

-- AddForeignKey
ALTER TABLE "borrowRecords" ADD CONSTRAINT "borrowRecords_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("bookId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrowRecords" ADD CONSTRAINT "borrowRecords_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("memberId") ON DELETE CASCADE ON UPDATE CASCADE;
