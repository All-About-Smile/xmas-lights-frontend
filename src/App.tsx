import './App.css'
import { Routes, Route } from "react-router-dom";
import GlobalSettingTestPage from './pages/test/GlobalSettingTestPage';
import LoginPage from './pages/test/LoginPage';
import TestHome from './pages/test/TestHome';
import HomePage from './pages/HomePage';

import LoginPage2 from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import FindAccountPage from "./pages/FindAccountPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<TestHome />} />
      <Route path="/light" element={<GlobalSettingTestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login2" element={<LoginPage2 />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account/settings" element={<AccountSettingsPage />} />
      <Route path="/account/find" element={<FindAccountPage />} />
    </Routes>
  )
}

export default App



