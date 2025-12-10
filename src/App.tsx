import './App.css'
import { Routes, Route } from "react-router-dom";
import GlobalSettingTestPage from './pages/test/GlobalSettingTestPage';
import LoginPage from './pages/test/LoginPage';
import TestHome from './pages/test/TestHome';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<TestHome />} />
      <Route path="/light" element={<GlobalSettingTestPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App



