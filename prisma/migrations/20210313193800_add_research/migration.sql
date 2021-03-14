-- CreateTable
CREATE TABLE "Research" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "dateOpened" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateClosed" DATETIME,
    "status" TEXT NOT NULL,
    FOREIGN KEY ("templateId") REFERENCES "ResearchTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
