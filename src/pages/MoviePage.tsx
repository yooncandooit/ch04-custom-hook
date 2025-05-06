import { useState } from "react";
import { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import PaginationBtn from "../components/PaginationBtn";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch"; // 이거 빠졌으면 꼭 추가

export default function MoviePage() {
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();

  const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;

  const {
    data: movies,
    isPending,
    isError,
  } = useCustomFetch<MovieResponse>(url);

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

      {!isPending && movies && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
