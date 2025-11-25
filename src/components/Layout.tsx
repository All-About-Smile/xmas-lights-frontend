import { Link, useNavigate } from 'react-router-dom';
import type { Session } from '../types';

type LayoutProps = {
  session: Session | null;
  onLogout: () => void;
  children: React.ReactNode;
};

const Layout = ({ session, onLogout, children }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="brand" onClick={() => navigate('/')}>
          <div className="brand-mark" />
          <div className="brand-copy">
            <span className="brand-name">Xmas Lights</span>
            <span className="brand-sub">rolling paper</span>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">홈</Link>
          <Link to="/my">내 트리</Link>
          <Link to="/aurora">샘플 트리</Link>
        </nav>

        <div className="nav-actions">
          {session ? (
            <>
              <span className="user-chip">🎄 {session.user.nickname || session.user.id}</span>
              <button className="ghost-btn" onClick={onLogout}>
                로그아웃
              </button>
              <button className="primary-btn" onClick={() => navigate('/my')}>
                내 트리 관리
              </button>
            </>
          ) : (
            <>
              <button className="ghost-btn" onClick={() => navigate('/login')}>
                로그인
              </button>
              <button className="primary-btn" onClick={() => navigate('/signup')}>
                시작하기
              </button>
            </>
          )}
        </div>
      </header>

      <main className="page-body">{children}</main>

      <footer className="site-footer">
        <p>빛나는 편지를 모으는 롤링페이퍼 · 크리스마스 공개 {DEFAULT_OPEN_DATE}</p>
      </footer>
    </div>
  );
};

const DEFAULT_OPEN_DATE = '2025-12-25';

export default Layout;
