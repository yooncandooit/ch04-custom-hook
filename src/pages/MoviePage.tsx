import { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import PaginationBtn from "../components/PaginationBtn";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  // 1. 로딩
  const [isPending, setIsPending] = useState(false);
  // 2. 에러
  const [isError, setIsError] = useState(false);
// 3. pagenation
  const [page, setPage] = useState(1); // 현재 = 1페이지 상태

  const {category} = useParams<{
    category: string;
  }>();

  useEffect((): void => {
    const fetchMovie = async (): Promise<void> => {
      setIsPending(true);
 
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
    fetchMovie();
  }, [page, category]); // 페이지가 변경될때마다 렌더링 (의존성 배열)

  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러!</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-center gap-4 mt-8">
        <PaginationBtn
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          이전
        </PaginationBtn>
        <span>{page}페이지</span>
        <PaginationBtn onClick={() => setPage((prev) => prev + 1)}>
          다음
        </PaginationBtn>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies &&
            movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </>
  );
}
