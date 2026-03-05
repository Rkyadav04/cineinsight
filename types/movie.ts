// ─── Movie Types ──────────────────────────────────────────────────────────────

export interface MovieDetails {
  imdbID: string;
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genre: string;
  director: string;
  writer: string;
  actors: string;       // comma-separated cast string from OMDB
  plot: string;
  language: string;
  country: string;
  awards: string;
  poster: string;       // URL to poster image
  imdbRating: string;
  imdbVotes: string;
  metascore: string;
  type: string;
  totalSeasons?: string;
}

export type SentimentLabel = "positive" | "mixed" | "negative";

export interface SentimentAnalysis {
  label: SentimentLabel;
  score: number;           // 0-100 numeric score
  summary: string;         // 2-3 sentence narrative
  highlights: string[];    // 3 key audience themes
  criticsNote: string;     // one sentence on critical reception
}

export interface MovieInsightResponse {
  movie: MovieDetails;
  sentiment: SentimentAnalysis;
}

export interface APIError {
  error: string;
  details?: string;
}
