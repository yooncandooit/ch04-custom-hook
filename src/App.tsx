import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//createBrowserRouter v6

import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailPage from "./pages/MovieDetailPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // Routelayout?? 페이지 이동 안되는 이슈
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "movies/:category", // category는 문자열만 허용
        element: <MoviePage />,
      },
      {
        path: "movie-detail/:movieId",
        element: <MovieDetailPage />,
      }      
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
