-- CreateTable
CREATE TABLE "ResearchAnswers" (
    "studentId" INTEGER NOT NULL,
    "researchId" INTEGER NOT NULL,
    "answer" TEXT,

    PRIMARY KEY ("studentId", "researchId"),
    FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("researchId") REFERENCES "Research" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
