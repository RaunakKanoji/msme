-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "AccountAggregatorConsent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalConsentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "vuaMasked" TEXT NOT NULL,
    "fetchType" TEXT NOT NULL,
    "consentMode" TEXT NOT NULL,
    "consentTypes" TEXT[],
    "fiTypes" TEXT[],
    "purposeCode" TEXT NOT NULL,
    "purposeText" TEXT NOT NULL,
    "dataFrom" TIMESTAMP(3) NOT NULL,
    "dataTo" TIMESTAMP(3) NOT NULL,
    "consentStartsAt" TIMESTAMP(3) NOT NULL,
    "consentExpiresAt" TIMESTAMP(3) NOT NULL,
    "dataLifeValue" INTEGER NOT NULL,
    "dataLifeUnit" TEXT NOT NULL,
    "frequencyValue" INTEGER NOT NULL,
    "frequencyUnit" TEXT NOT NULL,
    "redirectUrlEncrypted" TEXT,
    "providerTraceId" TEXT,
    "rejectionCode" TEXT,
    "rejectionMessage" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "lastReconciledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountAggregatorConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountAggregatorDataSession" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalSessionId" TEXT NOT NULL,
    "consentId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "dataFrom" TIMESTAMP(3) NOT NULL,
    "dataTo" TIMESTAMP(3) NOT NULL,
    "providerTraceId" TEXT,
    "fetchAttemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastFetchAttemptAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountAggregatorDataSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalFinancialAccount" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "consentId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "fipId" TEXT NOT NULL,
    "linkedAccountReference" TEXT NOT NULL,
    "maskedAccountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "fiType" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentBalance" DECIMAL(18,2),
    "balanceAsOf" TIMESTAMP(3),
    "branchName" TEXT,
    "ifscMaskedOrEncrypted" TEXT,
    "openedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalFinancialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "financialAccountId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerTransactionId" TEXT,
    "deduplicationHash" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mode" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "balanceAfterTransaction" DECIMAL(18,2),
    "narrationEncrypted" TEXT,
    "referenceEncrypted" TEXT,
    "transactionTimestamp" TIMESTAMP(3) NOT NULL,
    "valueDate" TIMESTAMP(3),
    "category" TEXT,
    "subcategory" TEXT,
    "counterpartyHash" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "isProbableLoanPayment" BOOLEAN NOT NULL DEFAULT false,
    "isProbableSalaryOrRevenue" BOOLEAN NOT NULL DEFAULT false,
    "isProbableBankCharge" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialSnapshot" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "sourceSessionId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "dataCompleteness" DOUBLE PRECISION NOT NULL,
    "accountCount" INTEGER NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "totalInflows" DECIMAL(18,2) NOT NULL,
    "totalOutflows" DECIMAL(18,2) NOT NULL,
    "netCashFlow" DECIMAL(18,2) NOT NULL,
    "averageMonthlyInflow" DECIMAL(18,2) NOT NULL,
    "averageMonthlyOutflow" DECIMAL(18,2) NOT NULL,
    "averageBalance" DECIMAL(18,2) NOT NULL,
    "minimumBalance" DECIMAL(18,2) NOT NULL,
    "maximumBalance" DECIMAL(18,2) NOT NULL,
    "cashFlowVolatility" DOUBLE PRECISION NOT NULL,
    "inflowVolatility" DOUBLE PRECISION NOT NULL,
    "negativeCashFlowMonths" INTEGER NOT NULL,
    "lowBalanceDays" INTEGER NOT NULL,
    "revenueConcentration" DOUBLE PRECISION NOT NULL,
    "recurringObligationAmount" DECIMAL(18,2) NOT NULL,
    "estimatedDebtService" DECIMAL(18,2) NOT NULL,
    "debtServiceCoverageProxy" DOUBLE PRECISION NOT NULL,
    "liquidityBufferDays" DOUBLE PRECISION NOT NULL,
    "financialHealthScore" DOUBLE PRECISION,
    "calculationVersion" TEXT NOT NULL,
    "featureVector" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "financialSnapshotId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "featureSchemaVersion" TEXT NOT NULL,
    "probabilityOfDefault" DOUBLE PRECISION NOT NULL,
    "riskBand" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "dataQualityScore" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,
    "topRiskFactors" JSONB NOT NULL,
    "topPositiveFactors" JSONB NOT NULL,
    "predictionWindowMonths" INTEGER NOT NULL DEFAULT 12,
    "predictedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "payloadEncrypted" TEXT,
    "processingStatus" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialDataAuditEvent" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT,
    "actorId" TEXT,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialDataAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountAggregatorConsent_organisationId_status_idx" ON "AccountAggregatorConsent"("organisationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccountAggregatorConsent_provider_externalConsentId_key" ON "AccountAggregatorConsent"("provider", "externalConsentId");

-- CreateIndex
CREATE INDEX "AccountAggregatorDataSession_organisationId_status_idx" ON "AccountAggregatorDataSession"("organisationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccountAggregatorDataSession_provider_externalSessionId_key" ON "AccountAggregatorDataSession"("provider", "externalSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalFinancialAccount_provider_linkedAccountReference_key" ON "ExternalFinancialAccount"("provider", "linkedAccountReference");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialTransaction_deduplicationHash_key" ON "FinancialTransaction"("deduplicationHash");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_externalEventId_key" ON "WebhookEvent"("provider", "externalEventId");

-- CreateIndex
CREATE INDEX "FinancialDataAuditEvent_organisationId_occurredAt_idx" ON "FinancialDataAuditEvent"("organisationId", "occurredAt");

-- AddForeignKey
ALTER TABLE "AccountAggregatorDataSession" ADD CONSTRAINT "AccountAggregatorDataSession_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "AccountAggregatorConsent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFinancialAccount" ADD CONSTRAINT "ExternalFinancialAccount_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "AccountAggregatorConsent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_financialAccountId_fkey" FOREIGN KEY ("financialAccountId") REFERENCES "ExternalFinancialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialSnapshot" ADD CONSTRAINT "FinancialSnapshot_sourceSessionId_fkey" FOREIGN KEY ("sourceSessionId") REFERENCES "AccountAggregatorDataSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_financialSnapshotId_fkey" FOREIGN KEY ("financialSnapshotId") REFERENCES "FinancialSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
