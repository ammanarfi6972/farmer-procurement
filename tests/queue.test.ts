import { describe, it, expect } from "vitest";

// Example domain logic for ETA calculation
function calculateETA(farmersAhead: number, activeCounters: number, avgServiceTimeMin: number) {
  if (activeCounters === 0) return Infinity;
  return (farmersAhead * avgServiceTimeMin) / activeCounters;
}

describe("Queue Engine ETA", () => {
  it("calculates basic ETA correctly", () => {
    const eta = calculateETA(10, 2, 5); // 10 ahead, 2 counters, 5 min each
    expect(eta).toBe(25); // (10 * 5) / 2 = 25 minutes
  });

  it("handles zero active counters", () => {
    const eta = calculateETA(5, 0, 5);
    expect(eta).toBe(Infinity);
  });
});
