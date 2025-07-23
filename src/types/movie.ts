export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
}
