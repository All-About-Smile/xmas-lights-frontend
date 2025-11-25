import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import MyPage from './pages/MyPage';
import PublicPaperPage from './pages/PublicPaper';
import WriteLetterPage from './pages/WriteLetter';
import LetterDetailPage from './pages/LetterDetail';
import type { Session } from './types';
import { bootstrapDemoSession } from './services/mockApi';
import './App.css';

function App() {
  const [session, setSession] = useState<Session | null>(bootstrapDemoSession());

  const handleLogout = () => setSession(null);

  return (
    <BrowserRouter>
      <Layout session={session} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage session={session} />} />
          <Route path="/login" element={<LoginPage onAuth={setSession} />} />
          <Route path="/signup" element={<SignupPage onAuth={setSession} />} />
          <Route path="/my" element={<MyPage session={session} />} />
          <Route path="/:userId" element={<PublicPaperPage />} />
          <Route path="/:userId/write" element={<WriteLetterPage />} />
          <Route path="/:userId/letters/:letterId" element={<LetterDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
