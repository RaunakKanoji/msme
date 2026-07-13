// Configurable risk bands (Section 2.3). Cut-offs live here as versioned configuration — never hardcoded inside
// UI components — so the bank's risk team can retune them without touching pages.
export type HealthBandName = "Strong" | "Healthy" | "Watch" | "Weak" | "Critical";
export type PdBandName = "LOW" | "LOW_MODERATE" | "MODERATE" | "HIGH" | "VERY_HIGH";
export type BandConfig<T extends string> = { version: string; bands: Array<{ name: T; min: number; max: number }> };
export const HEALTH_BAND_CONFIG: BandConfig<HealthBandName> = {
  version: "health-bands-v1",
  bands: [
    { name: "Strong", min: 80, max: 100 },
    { name: "Healthy", min: 65, max: 79 },
    { name: "Watch", min: 50, max: 64 },
    { name: "Weak", min: 35, max: 49 },
    { name: "Critical", min: 0, max: 34 },
  ],
};
// PD bands on the probability (0..1). Independently configurable from health bands.
export const PD_BAND_CONFIG: BandConfig<PdBandName> = {
  version: "pd-bands-v1",
  bands: [
    { name: "LOW", min: 0, max: 0.0249 },
    { name: "LOW_MODERATE", min: 0.025, max: 0.0599 },
    { name: "MODERATE", min: 0.06, max: 0.1199 },
    { name: "HIGH", min: 0.12, max: 0.2499 },
    { name: "VERY_HIGH", min: 0.25, max: 1 },
  ],
};
export function healthBand(score: number, config: BandConfig<HealthBandName> = HEALTH_BAND_CONFIG): HealthBandName {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return (config.bands.find((b) => s >= b.min && s <= b.max) ?? config.bands[config.bands.length - 1]).name;
}
export function pdBand(pd: number, config: BandConfig<PdBandName> = PD_BAND_CONFIG): PdBandName {
  const p = Math.max(0, Math.min(1, pd));
  return (config.bands.find((b) => p >= b.min && p <= b.max) ?? config.bands[config.bands.length - 1]).name;
}
