import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MovieDetail, CastMember, CrewMember } from "../types/movie";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<CrewMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {
        // 1. 영화 상세 정보 요청
        const movieRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        // 2. 출연진 + 감독 정보 요청
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 5)); // 상위 5명만 표시
        const directorData = creditsRes.data.crew.find(
          (member: CrewMember) => member.job === "Director"
        );
        setDirector(directorData || null);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isLoading)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );

  if (error || !movie)
    return <div className="text-red-500 p-8">에러!</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} 포스터 사진`}
        className="mb-4 rounded-lg"
      />
      <p className="mb-2">감독: {director ? director.name : "정보 없음"}</p>
      <p className="mb-2">개봉일: {movie.release_date}</p>
      <p className="mb-2">평점: {movie.vote_average}</p>

      <p className="mt-4">{movie.overview}</p>
      
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
    </div>
  );
}
