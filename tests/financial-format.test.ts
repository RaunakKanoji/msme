import assert from "node:assert/strict"; import test from "node:test";
import { formatInrCompact, formatPeriod, monthlyTrend } from "../lib/financial-data/format.ts";
import { cardStatus } from "../lib/financial-data/presentation.ts";
import { buildMockSnapshot } from "../lib/financial-data/providers/mock/mock-data.ts";

test("formats INR in compact Indian notation", () => {
  assert.equal(formatInrCompact(1450000), "₹14.5L");
  assert.equal(formatInrCompact(12000000), "₹1.2Cr");
  assert.equal(formatInrCompact(2500), "₹2.5K");
  assert.equal(formatInrCompact(-340000), "-₹3.4L");
  assert.equal(formatInrCompact(950), "₹950");
});

test("monthly trend buckets revenue and expenses per month", () => {
  const snap = buildMockSnapshot("stable-business", { businessId: "b" });
  const trend = monthlyTrend(snap);
  assert.equal(trend.length, 12);
  for (const point of trend) { assert.ok(point.revenue > 0); assert.ok(point.expenses > 0); assert.ok(point.label.length > 0); }
  const totalRevenue = trend.reduce((s, p) => s + p.revenue, 0);
  assert.equal(Math.round(totalRevenue / trend.length), snap.monthlyRevenue);
});

test("formats a reporting period", () => {
  assert.match(formatPeriod("2025-07-01T00:00:00.000Z", "2026-06-30T00:00:00.000Z"), /2025.*2026/);
});

test("maps engine statuses to semantic card statuses", () => {
  assert.equal(cardStatus("good"), "positive");
  assert.equal(cardStatus("watch"), "warning");
  assert.equal(cardStatus("risk"), "negative");
  assert.equal(cardStatus("unavailable"), "neutral");
});
