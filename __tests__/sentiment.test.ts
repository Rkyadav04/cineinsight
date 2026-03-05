// Unit tests for sentiment label logic

import type { SentimentLabel } from "../types/movie";

// Pure helper: given a numeric score, return expected label bucket
function scoreToBucket(score: number): SentimentLabel {
  if (score >= 70) return "positive";
  if (score >= 40) return "mixed";
  return "negative";
}

describe("scoreToBucket helper", () => {
  it("scores >= 70 are positive", () => {
    expect(scoreToBucket(100)).toBe("positive");
    expect(scoreToBucket(70)).toBe("positive");
  });

  it("scores 40–69 are mixed", () => {
    expect(scoreToBucket(55)).toBe("mixed");
    expect(scoreToBucket(40)).toBe("mixed");
    expect(scoreToBucket(69)).toBe("mixed");
  });

  it("scores < 40 are negative", () => {
    expect(scoreToBucket(0)).toBe("negative");
    expect(scoreToBucket(39)).toBe("negative");
  });
});
