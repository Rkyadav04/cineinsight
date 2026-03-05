// ─── Google Gemini AI Client ──────────────────────────────────────────────────
// Uses Google's free Gemini API to generate structured sentiment analysis.
// Get a free API key at: https://aistudio.google.com/app/apikey (no credit card needed)

import { GoogleGenerativeAI } from "@google/generative-ai";
import { SentimentAnalysis, MovieDetails } from "@/types/movie";

/**
 * Prompts Gemini to produce a structured sentiment analysis for a given movie.
 * Returns a parsed SentimentAnalysis object.
 */
export async function generateSentimentAnalysis(
  movie: MovieDetails
): Promise<SentimentAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add it to your .env.local file. Get a free key at https://aistudio.google.com/app/apikey"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `You are a film critic and data analyst. Analyze audience sentiment for the movie below using your knowledge of its critical reception, box office performance, audience reviews, and cultural impact.

Movie Details:
- Title: ${movie.title} (${movie.year})
- Genre: ${movie.genre}
- Director: ${movie.director}
- Cast: ${movie.actors}
- IMDb Rating: ${movie.imdbRating}/10 (${movie.imdbVotes} votes)
- Metascore: ${movie.metascore}
- Awards: ${movie.awards}
- Plot: ${movie.plot}

Respond ONLY with a valid JSON object in this exact shape (no markdown, no preamble, no backticks):
{
  "label": "positive",
  "score": 85,
  "summary": "2-3 sentence narrative summarizing how audiences and critics received this film",
  "highlights": ["theme 1", "theme 2", "theme 3"],
  "criticsNote": "one sentence on critical vs audience reception"
}

label must be exactly one of: positive, mixed, negative
score must be an integer from 0 to 100`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip any accidental markdown fences before parsing
  const cleaned = text.replace(/```json|```/g, "").trim();

  let parsed: SentimentAnalysis;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse sentiment JSON from Gemini response");
  }

  // Validate required fields
  if (!parsed.label || typeof parsed.score !== "number" || !parsed.summary) {
    throw new Error("Gemini returned an incomplete sentiment object");
  }

  return parsed;
}
