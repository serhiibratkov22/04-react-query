import axios from "axios";
import type { Movie } from "../types/movie.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
});

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const getImageUrl = (
  imagePath: string | null,
  size: "w500" | "original" = "w500"
): string =>
  imagePath ? `https://image.tmdb.org/t/p/${size}${imagePath}` : "";

export const fetchMovie = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  const { data } = await api.get<MoviesResponse>("/search/movie", {
    params: { query, page },
  });
  return data;
};
