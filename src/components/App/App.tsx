import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovie } from "../../services/movieService";
import type { MoviesResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error, isSuccess, isFetching } = useQuery<
    MoviesResponse,
    Error
  >({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovie(query, page),
    enabled: !!query.trim(),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
    retry: false,
  });

  const handleSubmit = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error("Please enter a search query.");
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSelect = (movie: Movie) => setCurrentMovie(movie);
  const onClose = () => setCurrentMovie(null);

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster position="top-center" />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage message={error?.message} />}

      {isSuccess && data?.results.length > 0 && (
        <>
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
          <MovieGrid movies={data.results} onSelect={onSelect} />
        </>
      )}

      {currentMovie && <MovieModal movie={currentMovie} onClose={onClose} />}
    </>
  );
}

export default App;
