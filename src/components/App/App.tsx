import SearchBar from "../SearchBar/SearchBar";
import { handleSearch } from "../../services/movieService.ts";
import { useState } from "react";
import type { Movie } from "../../types/movie.ts";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchSearch(search: string) {
    setIsLoader(true);
    setIsError(false);
    setHasSearched(true);

    try {
      const data = await handleSearch(search);

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response from server");
      }

      setMovies(data);

      if (data.length === 0) {
        toast("No movies found for your request.");
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMovies([]);
    } finally {
      setIsLoader(false);
    }
  }

  function handleSelectMovie(movie: Movie) {
    setSelectMovie(movie);
  }

  function onCloseModal() {
    setSelectMovie(null);
  }
  return (
    <>
      <SearchBar onSubmit={fetchSearch} />

      {isLoader && <Loader />}

      {!isLoader && isError && <ErrorMessage />}

      {!isLoader && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {!isLoader && !isError && movies.length === 0 && hasSearched && (
        <ErrorMessage />
      )}

      {selectMovie && <MovieModal movie={selectMovie} onClose={onCloseModal} />}
    </>
  );
}
