-- Prevent duplicate attendance records for the same user and session.
CREATE UNIQUE INDEX "RSVP_userId_sessionId_key" ON "RSVP"("userId", "sessionId");