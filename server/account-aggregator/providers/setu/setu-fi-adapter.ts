// Pure adapter (no `server-only`, no I/O) that flattens Setu's GET /sessions/:id response into the flat account
// records `normalization-service.normalizeAccount` expects. Setu nests FI data as:
//   fips[].accounts[].data.account.{ summary, transactions.transaction[] }
// See https://docs.setu.co/data/account-aggregator/api-integration/data-apis
type Dict = Record<string, unknown>;
const asDict = (value: unknown): Dict => (value && typeof value === "object" ? (value as Dict) : {});
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const str = (value: unknown): string | undefined => (typeof value === "string" ? value : typeof value === "number" ? String(value) : undefined);

export function flattenSetuFinancialData(fips: unknown): Dict[] {
  const out: Dict[] = [];
  for (const fipRaw of asArray(fips)) {
    const fip = asDict(fipRaw);
    const fipId = str(fip.fipID) ?? str(fip.fipId);
    for (const accountRaw of asArray(fip.accounts)) {
      const outer = asDict(accountRaw);
      const account = asDict(asDict(outer.data).account);
      const summary = asDict(account.summary);
      const linkedAccRef = str(account.linkedAccRef) ?? str(outer.linkRefNumber);
      if (!linkedAccRef) continue; // an account with no reference cannot be normalized
      const transactions = asArray(asDict(account.transactions).transaction).map((txRaw) => {
        const tx = asDict(txRaw);
        return {
          id: str(tx.txnId),
          type: str(tx.type),
          mode: str(tx.mode),
          amount: str(tx.amount),
          currency: str(summary.currency),
          balance: str(tx.currentBalance),
          transactionTimestamp: str(tx.transactionTimestamp),
          valueDate: str(tx.valueDate),
          reference: str(tx.reference) ?? str(tx.narration)
        };
      });
      out.push({
        fipId,
        linkedAccRef,
        maskedAccNumber: str(account.maskedAccNumber) ?? str(outer.maskedAccNumber),
        type: str(summary.type) ?? str(account.type),
        currency: str(summary.currency),
        status: str(summary.status) ?? str(outer.status),
        currentBalance: str(summary.currentBalance),
        balanceAsOf: str(summary.balanceDateTime),
        transactions
      });
    }
  }
  return out;
}
