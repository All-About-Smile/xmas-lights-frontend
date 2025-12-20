import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import AccountSettingsPage from "../pages/AccountSettingsPage";
import ReadLetterPage from "../pages/ReadLetterPage";

export const privateRoutes: RouteObject[] = [
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/account/settings",
    element: (
      <ProtectedRoute>
        <AccountSettingsPage />
      </ProtectedRoute>
    ),
  },
  // 편지 임시 페이지 (나중에 삭제 예정)
  {
    path:"/users/:userid/letters/:letter_number",
    element:(
      <ProtectedRoute>
        <ReadLetterPage />
      </ProtectedRoute>
    ),
  },
];
