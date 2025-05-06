import { useEffect, useState } from "react";
import axios from "axios";

// 제네릭 타입을 받아서 API 응답을 다룸
interface ApiResponse<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

type Language = "ko-KR" | "en-US";

function useCustomFetch<T>(url: string, language: Language="en-US"): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const {data} = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [url, language]);

  return { data, isPending, isError };
}

export default useCustomFetch;
