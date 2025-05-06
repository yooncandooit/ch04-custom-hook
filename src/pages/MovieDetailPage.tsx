import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CastMember, CrewMember, MovieDetailResponse } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<CrewMember | null>(null);

  const url: string = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const { isPending, isError, data: movieData } = useCustomFetch<MovieDetailResponse>(url, "ko-KR");

  // 출연진 & 감독 정보 fetch
  useEffect(() => {
    const fetchCredits = async () => {
      if (!movieId) return;

      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setCast(data.cast.slice(0, 5)); // 주요 출연진 5명
        const director = data.crew.find(
          (member: CrewMember) => member.job === "Director"
        );
        setDirector(director || null);
      } catch (e) {
        console.error("출연진 데이터를 불러오는 중 오류 발생", e);
      }
    };

    fetchCredits();
  }, [movieId]);

  if (isError || !movieData)
    return <div className="text-red-500 p-8">에러!</div>;

  return (
    <div className="p-8">
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">{movieData.title}</h1>
          <img
            src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
            alt={`${movieData.title} 포스터 사진`}
            className="mb-4 rounded-lg"
          />
          <p className="mb-2">감독: {director ? director.name : "정보 없음"}</p>
          <p className="mb-2">개봉일: {movieData.release_date}</p>
          <p className="mb-2">평점: {movieData.vote_average}</p>
          <p className="mt-4">{movieData.overview}</p>

          <h2 className="text-xl font-bold mt-8 mb-4">주요 출연진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {cast.map((actor) => (
              <div key={actor.id} className="text-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "/default-profile.png"
                  }
                  alt={`${actor.name} 프로필`}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
                <p className="font-semibold">{actor.name}</p>
                <p className="text-sm text-gray-500">({actor.character})</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
