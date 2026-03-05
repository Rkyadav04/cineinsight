// ─── API Route: /api/movie ────────────────────────────────────────────────────
// GET /api/movie?id=tt0133093
// Fetches movie details from OMDB and generates AI sentiment via Claude.
// Both steps run in parallel once we have the movie data.

import { NextRequest, NextResponse } from "next/server";
import { fetchMovieFromOmdb, isValidImdbId, searchMoviesByName } from "@/lib/omdb";
import { generateSentimentAnalysis } from "@/lib/gemini";
import { MovieInsightResponse, APIError } from "@/types/movie";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const imdbId = searchParams.get("id")?.trim()   ?? "";
  const name   = searchParams.get("name")?.trim() ?? "";

  // Mode 1: Lookup by IMDb ID
  if (imdbId) {
    if (!isValidImdbId(imdbId)) {
      return NextResponse.json({ error: "Invalid IMDb ID format." }, { status: 400 });
    }
    return fetchAndAnalyze(imdbId);
  }

  // Mode 2: Search by movie name
  if (name) {
    if (name.length < 2) {
      return NextResponse.json({ error: "Query must be at least 2 characters." }, { status: 400 });
    }
    let results;
    try {
      results = await searchMoviesByName(name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      return NextResponse.json({ error: message }, { status: 404 });
    }

    // Only one result → skip picker, go straight to full analysis
    if (results.length === 1) return fetchAndAnalyze(results[0].imdbID);

    // Multiple results → return list for frontend picker
    return NextResponse.json({ results }, { status: 200 });
  }

  return NextResponse.json({ error: "Provide ?id=tt... or ?name=Movie+Title" }, { status: 400 });
}

/** Shared helper: fetch full details then run AI sentiment */
async function fetchAndAnalyze(imdbId: string) {
  let movie;
  try {
    movie = await fetchMovieFromOmdb(imdbId);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 404 });
  }

  let sentiment;
  try {
    sentiment = await generateSentimentAnalysis(movie);
  } catch (err) {
    return NextResponse.json({ error: `Sentiment failed: ${err instanceof Error ? err.message : ""}` }, { status: 500 });
  }

  return NextResponse.json({ movie, sentiment }, { status: 200 });
}
