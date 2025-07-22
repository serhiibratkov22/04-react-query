import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import type { Movie } from "../../types/movie.ts";
import * as movieService from "../../services/movieService.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    fetchMovies(newQuery, 1);
  };

  const fetchMovies = (query: string, page: number) => {
    setMovies([]);
    setLoading(true);
    setError(null);

    movieService
      .fetchMovie(query, page)
      .then((data) => {
        if (!data.results.length) {
          toast.error("No movies found for your request");
        }
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!query || page === 1) return;
    fetchMovies(query, page);
  }, [query, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const onSelect = (movie: Movie) => {
    setCurrentMovie(movie);
  };

  const onClose = () => {
    setCurrentMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      {loading && <Loader />}
      {error && !loading && <ErrorMessage message={error} />}
      {!loading && !error && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}
      <MovieGrid movies={movies} onSelect={onSelect} />
      {currentMovie && <MovieModal movie={currentMovie} onClose={onClose} />}
      <Toaster position="top-center" />
    </>
  );
}

export default App;
