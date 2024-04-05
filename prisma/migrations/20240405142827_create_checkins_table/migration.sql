-- CreateTable
CREATE TABLE "check-ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created-at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendee-id" INTEGER NOT NULL,
    CONSTRAINT "check-ins_attendee-id_fkey" FOREIGN KEY ("attendee-id") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "check-ins_attendee-id_key" ON "check-ins"("attendee-id");
