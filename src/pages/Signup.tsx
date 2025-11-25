import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/mockApi';
import type { Session } from '../types';
import type { FormEvent } from 'react';

type Props = {
  onAuth: (session: Session) => void;
};

const SignupPage = ({ onAuth }: Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const session = await signup({ email, password, nickname });
      onAuth(session);
      navigate('/my');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <p className="eyebrow">회원가입</p>
        <h2>나만의 트리 만들기</h2>
        <p className="lede">
          이메일과 비밀번호를 입력하면 개인 롤링페이퍼가 자동으로 생성됩니다. 링크를 복사해
          친구들에게 공유하세요.
        </p>

        <form onSubmit={handleSubmit} className="stack">
          <label className="field">
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </label>
          <label className="field">
            <span>비밀번호 확인</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={4}
            />
          </label>
          <label className="field">
            <span>닉네임 (선택)</span>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="별명 또는 이름"
            />
          </label>
          {error && <div className="error-banner">{error}</div>}
          <button className="primary-btn lg" type="submit" disabled={busy}>
            {busy ? '잠시만요...' : '가입하고 트리 만들기'}
          </button>
        </form>
        <p className="subtle">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
