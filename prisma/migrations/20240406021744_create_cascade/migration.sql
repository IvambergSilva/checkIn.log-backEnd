-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "socialName" TEXT,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "customGender" TEXT,
    "treatAs" TEXT,
    "accessibility" TEXT,
    "created-at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event-id" TEXT NOT NULL,
    CONSTRAINT "attendees_event-id_fkey" FOREIGN KEY ("event-id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_attendees" ("accessibility", "age", "created-at", "customGender", "email", "event-id", "gender", "id", "name", "socialName", "treatAs") SELECT "accessibility", "age", "created-at", "customGender", "email", "event-id", "gender", "id", "name", "socialName", "treatAs" FROM "attendees";
DROP TABLE "attendees";
ALTER TABLE "new_attendees" RENAME TO "attendees";
CREATE UNIQUE INDEX "attendees_event-id_email_key" ON "attendees"("event-id", "email");
CREATE TABLE "new_check-ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created-at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee-id" INTEGER NOT NULL,
    CONSTRAINT "check-ins_attendee-id_fkey" FOREIGN KEY ("attendee-id") REFERENCES "attendees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check-ins" ("attendee-id", "created-at", "id") SELECT "attendee-id", "created-at", "id" FROM "check-ins";
DROP TABLE "check-ins";
ALTER TABLE "new_check-ins" RENAME TO "check-ins";
CREATE UNIQUE INDEX "check-ins_attendee-id_key" ON "check-ins"("attendee-id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
