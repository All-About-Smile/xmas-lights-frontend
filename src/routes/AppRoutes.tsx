import { useRoutes } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // ✅ Hook은 항상 호출 (조건문/return보다 위)
  const element = useRoutes([
    ...publicRoutes(isAuthenticated),
    ...privateRoutes,
  ]);

  // ✅ 화면만 조건 분기
  if (isLoading) return <div>Loading...</div>;

  return element;
}
