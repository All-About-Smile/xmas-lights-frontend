import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import FindAccountPage from "../pages/FindAccountPage";
import GuestUserHomePage from "@/pages/GuestUserHomePage";
import WriteLetterPage from "@/pages/WriteLetterPage";

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
    { 
      path: "/users/:userid", 
      element: <GuestUserHomePage /> 
    },
    { 
      path: "/users/:userid/letters",
       element: <WriteLetterPage /> 
    },
    { 
      path: "/users/:userid/letters/:letterNumber/edit", 
      element: <WriteLetterPage /> 
    },
    // { 
    //   path: "/users/:userid/letters/:letterNumber/edit", 
    //   element: <EditLetterPage /> 
    // },

  ];
}
