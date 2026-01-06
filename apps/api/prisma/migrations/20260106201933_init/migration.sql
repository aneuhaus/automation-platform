-- CreateIndex
CREATE INDEX "requests_workflowId_status_idx" ON "requests"("workflowId", "status");
