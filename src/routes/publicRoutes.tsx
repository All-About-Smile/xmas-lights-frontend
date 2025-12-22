import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import FindAccountPage from "../pages/FindAccountPage";
import GuestUserHomePage from "@/pages/GuestUserHomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import WriteLetterPage from "@/pages/WriteLetterPage";
import WriteLockGuard from "./WriteLockGuard";
import HelpPage from "@/pages/HelpPage";

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
      path: "/help",
      element: <HelpPage />,
    },
    {
      path: "/account/find",
      element: <FindAccountPage />,
    },
    { 
      path: "/users/:userid", 
      element: <GuestUserHomePage /> 
    },
    { 
      path: "/users/:userid/letters",
      element: (
      <WriteLockGuard>
        <WriteLetterPage />
      </WriteLockGuard>
    ),
    },
     { 
      path: "/404",
       element: <NotFoundPage /> 
    },
    { 
      path: "*",
       element: <NotFoundPage /> 
    },
  ];
}
