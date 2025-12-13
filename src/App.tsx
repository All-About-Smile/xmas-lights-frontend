import './App.css'
import { Routes, Route,Navigate  } from "react-router-dom";
import GlobalSettingTestPage from './pages/test/GlobalSettingTestPage';
import TestHome from './pages/test/TestHome';
import HomePage from './pages/HomePage';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import FindAccountPage from "./pages/FindAccountPage";
import LandingPage from "./pages/LandingPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";


function App() {

  const { isAuthenticated, isLoading } = useAuth();
  
  // 새로고침 복원 중 깜빡임 방지
  if (isLoading) return null;  

  return (
    <Routes>
      {/* ✅ 첫 진입 화면 */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
      />

      {/* ✅ 로그인 후 홈 */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/test" element={<TestHome />} />
      <Route path="/light" element={<GlobalSettingTestPage />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/account/settings"
        element={
          <ProtectedRoute>
            <AccountSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/account/find" element={<FindAccountPage />} />
    </Routes>
  )
}

export default App



