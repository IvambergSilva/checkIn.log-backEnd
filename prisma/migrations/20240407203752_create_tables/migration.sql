-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum-attendees" INTEGER
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" TEXT NOT NULL PRIMARY KEY,
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

-- CreateTable
CREATE TABLE "check-ins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created-at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee-id" TEXT NOT NULL,
    CONSTRAINT "check-ins_attendee-id_fkey" FOREIGN KEY ("attendee-id") REFERENCES "attendees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event-id_email_key" ON "attendees"("event-id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check-ins_attendee-id_key" ON "check-ins"("attendee-id");
