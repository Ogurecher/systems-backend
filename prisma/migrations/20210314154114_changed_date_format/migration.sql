/*
  Warnings:

  - You are about to alter the column `dateOpened` on the `Research` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - You are about to alter the column `dateClosed` on the `Research` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Research" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "dateOpened" INTEGER NOT NULL,
    "dateClosed" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'В работе',
    FOREIGN KEY ("templateId") REFERENCES "ResearchTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Research" ("id", "title", "description", "templateId", "dateOpened", "dateClosed", "status") SELECT "id", "title", "description", "templateId", "dateOpened", "dateClosed", "status" FROM "Research";
DROP TABLE "Research";
ALTER TABLE "new_Research" RENAME TO "Research";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
