import { Link } from 'react-router-dom';
import type { Session } from '../types';

type Props = { session: Session | null };

const HomePage = ({ session }: Props) => {
  return (
    <div className="hero">
      <div className="hero-pane">
        <p className="eyebrow">빛을 모으는 롤링페이퍼</p>
        <h1>
          친구, 가족, 팀을 위한
          <br />
          <span className="highlight">크리스마스 트리 메시지</span>
        </h1>
        <p className="lede">
          링크 하나로 편지를 받고, 12월 25일에 한 번에 공개하세요. 트리에 걸린 오너먼트로
          편지가 채워지는 모습을 실시간으로 확인할 수 있습니다.
        </p>
        <div className="action-row">
          <Link to={session ? '/my' : '/signup'} className="primary-btn lg">
            {session ? '내 트리 보기' : '무료로 시작하기'}
          </Link>
          <Link to="/aurora" className="ghost-btn lg">
            샘플 트리 구경
          </Link>
        </div>
        <div className="pill-stack">
          <span>React + Vite</span>
          <span>JWT 세션</span>
          <span>공유 링크</span>
          <span>12/25 공개</span>
        </div>
      </div>
      <div className="panel-grid">
        <div className="panel">
          <h3>롤링페이퍼 생성</h3>
          <p>회원 가입 후 개인 트리가 자동 생성됩니다. 링크를 복사해 친구들에게 전달하세요.</p>
        </div>
        <div className="panel">
          <h3>게스트 편지 작성</h3>
          <p>로그인 없이도 링크만 있으면 오너먼트를 선택해 편지를 남길 수 있습니다.</p>
        </div>
        <div className="panel">
          <h3>크리스마스 공개</h3>
          <p>모든 편지는 2025-12-25 이후에 열려요. 기대감을 높이는 잠금 화면을 제공합니다.</p>
        </div>
        <div className="panel">
          <h3>관리 & 공유</h3>
          <p>내 트리에서 공유 링크를 복사하고, 받은 편지들을 한눈에 관리하세요.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
