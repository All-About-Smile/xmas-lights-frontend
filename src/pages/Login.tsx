import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/mockApi';
import type { Session } from '../types';
import type { FormEvent } from 'react';

type Props = {
  onAuth: (session: Session) => void;
};

const LoginPage = ({ onAuth }: Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('aurora@northpole.com');
  const [password, setPassword] = useState('snowglobe');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await login({ email, password });
      onAuth(session);
      navigate('/my');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mobile-screen login-screen">
      <div className="top-actions">
        <Link to="/" className="home-icon" aria-label="홈으로">
          🏠
        </Link>
      </div>
      <div className="login-body">
        <h1 className="login-title">로그인</h1>
        <form onSubmit={handleSubmit} className="stack login-form">
          <label className="field">
            <span>아이디</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error-banner">{error}</div>}
          <button className="primary-btn lg block" type="submit" disabled={busy}>
            {busy ? '잠시만요...' : '로그인 하기'}
          </button>
        </form>
        <div className="login-links">
          <span>아이디 찾기 | 비밀번호 찾기</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
