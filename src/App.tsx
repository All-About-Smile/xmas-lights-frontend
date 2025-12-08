import './App.css'
import { Routes, Route } from "react-router-dom";
import GlobalSettingTestPage from './pages/test/GlobalSettingTestPage';
import LoginPage from './pages/test/LoginPage';
import TestHome from './pages/test/TestHome';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestHome />} />
      <Route path="/light" element={<GlobalSettingTestPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App



