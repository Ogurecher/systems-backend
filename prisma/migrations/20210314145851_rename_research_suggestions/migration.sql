/*
  Warnings:

  - You are about to drop the `ResearchAnswers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ResearchAnswers";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ResearchSuggestions" (
    "studentId" INTEGER NOT NULL,
    "researchId" INTEGER NOT NULL,
    "answer" TEXT,

    PRIMARY KEY ("studentId", "researchId"),
    FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("researchId") REFERENCES "Research" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
