import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import FindAccountPage from "../pages/FindAccountPage";

export function publicRoutes(isAuthenticated: boolean): RouteObject[] {
  return [
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />,
    },
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />,
    },
    {
      path: "/register",
      element: isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />,
    },
    {
      path: "/account/find",
      element: <FindAccountPage />,
    },

    // 🔓 공유 링크 (Public) - 페이지 만들면 주석 해제
    // { path: "/share/:code", element: <ShareLandingPage /> },
    // { path: "/share/:code/write", element: <ShareWriteLetterPage /> },
  ];
}
