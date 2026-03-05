// ─── OMDB API Client ─────────────────────────────────────────────────────────
// Uses the free OMDB API (https://www.omdbapi.com/) which accepts IMDb IDs.
// Register at omdbapi.com for a free key (1,000 req/day).

import { MovieDetails } from "@/types/movie";

const OMDB_BASE_URL = "https://www.omdbapi.com/";

interface OmdbRawResponse {
  Response: "True" | "False";
  Error?: string;
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Metascore?: string;
  Type?: string;
  totalSeasons?: string;
}

/**
 * Validates that a string looks like a valid IMDb ID (tt + 7-8 digits).
 */
export function isValidImdbId(id: string): boolean {
  return /^tt\d{7,8}$/.test(id.trim());
}

/** Shape returned by OMDB's ?s= (search) endpoint */
export interface MovieSearchResult {
  imdbID: string;
  title:  string;
  year:   string;
  type:   string;
  poster: string;
}

/**
 * Searches movies by title name using OMDB ?s= endpoint.
 * Returns up to 10 matching results for the user to pick from.
 */
export async function searchMoviesByName(name: string): Promise<MovieSearchResult[]> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) throw new Error("OMDB_API_KEY is not configured.");

  const url = `${OMDB_BASE_URL}?s=${encodeURIComponent(name)}&type=movie&apikey=${apiKey}`;
  const res  = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`OMDB search failed with status ${res.status}`);

  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error ?? "No movies found");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.Search ?? []).map((item: any) => ({
    imdbID: item.imdbID,
    title:  item.Title,
    year:   item.Year,
    type:   item.Type,
    poster: item.Poster !== "N/A" ? item.Poster : "",
  }));
}
/**
 * Fetches movie metadata from OMDB using an IMDb ID.
 * Throws on HTTP errors or when OMDB returns Response:"False".
 */
export async function fetchMovieFromOmdb(imdbId: string): Promise<MovieDetails> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    throw new Error("OMDB_API_KEY is not configured. Please add it to your .env.local file.");
  }

  const url = `${OMDB_BASE_URL}?i=${encodeURIComponent(imdbId)}&plot=full&apikey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
  if (!res.ok) {
    throw new Error(`OMDB request failed with status ${res.status}`);
  }

  const data: OmdbRawResponse = await res.json();

  if (data.Response === "False") {
    throw new Error(data.Error ?? "Movie not found");
  }

  // Normalize the OMDB response into our clean MovieDetails shape
  return {
    imdbID: data.imdbID ?? imdbId,
    title: data.Title ?? "Unknown Title",
    year: data.Year ?? "N/A",
    rated: data.Rated ?? "N/A",
    released: data.Released ?? "N/A",
    runtime: data.Runtime ?? "N/A",
    genre: data.Genre ?? "N/A",
    director: data.Director ?? "N/A",
    writer: data.Writer ?? "N/A",
    actors: data.Actors ?? "N/A",
    plot: data.Plot ?? "No plot available.",
    language: data.Language ?? "N/A",
    country: data.Country ?? "N/A",
    awards: data.Awards ?? "N/A",
    poster: data.Poster && data.Poster !== "N/A" ? data.Poster : "",
    imdbRating: data.imdbRating ?? "N/A",
    imdbVotes: data.imdbVotes ?? "N/A",
    metascore: data.Metascore ?? "N/A",
    type: data.Type ?? "movie",
    totalSeasons: data.totalSeasons,
  };
}
