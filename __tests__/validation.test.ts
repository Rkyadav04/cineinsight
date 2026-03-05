// Unit tests for IMDb ID validation and data normalization utilities

import { isValidImdbId } from "../lib/omdb";

describe("isValidImdbId", () => {
  // Valid cases
  it("accepts a standard 7-digit IMDb ID", () => {
    expect(isValidImdbId("tt0133093")).toBe(true);
  });

  it("accepts an 8-digit IMDb ID", () => {
    expect(isValidImdbId("tt12345678")).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(isValidImdbId("  tt0133093  ")).toBe(true);
  });

  // Invalid cases
  it("rejects an empty string", () => {
    expect(isValidImdbId("")).toBe(false);
  });

  it("rejects an ID without the tt prefix", () => {
    expect(isValidImdbId("0133093")).toBe(false);
  });

  it("rejects an ID with fewer than 7 digits", () => {
    expect(isValidImdbId("tt01330")).toBe(false);
  });

  it("rejects an ID with more than 8 digits", () => {
    expect(isValidImdbId("tt012345678")).toBe(false);
  });

  it("rejects an ID with letters in the number portion", () => {
    expect(isValidImdbId("tt013309a")).toBe(false);
  });

  it("rejects a random movie title string", () => {
    expect(isValidImdbId("The Matrix")).toBe(false);
  });
});
