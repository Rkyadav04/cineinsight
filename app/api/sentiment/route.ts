// ─── API Route: /api/sentiment ────────────────────────────────────────────────
// POST /api/sentiment
// Standalone endpoint if you want to re-run sentiment without re-fetching movie.
// Body: { imdbId: string }  (re-fetches movie then runs AI)

import { NextRequest, NextResponse } from "next/server";
import { fetchMovieFromOmdb, isValidImdbId } from "@/lib/omdb";
import { generateSentimentAnalysis } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let body: { imdbId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const imdbId = body.imdbId?.trim() ?? "";

  if (!imdbId || !isValidImdbId(imdbId)) {
    return NextResponse.json({ error: "Invalid or missing imdbId in body" }, { status: 400 });
  }

  try {
    const movie     = await fetchMovieFromOmdb(imdbId);
    const sentiment = await generateSentimentAnalysis(movie);
    return NextResponse.json({ sentiment }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
