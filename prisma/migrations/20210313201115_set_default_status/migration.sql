-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Research" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,
    "dateOpened" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateClosed" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'В работе',
    FOREIGN KEY ("templateId") REFERENCES "ResearchTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Research" ("id", "title", "description", "templateId", "dateOpened", "dateClosed", "status") SELECT "id", "title", "description", "templateId", "dateOpened", "dateClosed", "status" FROM "Research";
DROP TABLE "Research";
ALTER TABLE "new_Research" RENAME TO "Research";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
