-- CreateTable
CREATE TABLE "attendees" (
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
    CONSTRAINT "attendees_event-id_fkey" FOREIGN KEY ("event-id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
