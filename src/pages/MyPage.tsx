import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrnamentCard from '../components/OrnamentCard';
import { getMyPaper, isOpenDate } from '../services/mockApi';
import type { PaperBundle, Session } from '../types';

type Props = {
  session: Session | null;
};

const MyPage = ({ session }: Props) => {
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<PaperBundle | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session) return;
    getMyPaper(session.token)
      .then((data) => setBundle(data))
      .catch((err) => setError(err instanceof Error ? err.message : '불러오기에 실패했습니다.'));
  }, [session]);

  if (!session) {
    return (
      <div className="page-message">
        <h2>로그인이 필요합니다.</h2>
        <p>내 트리를 보려면 먼저 로그인해주세요.</p>
        <button className="primary-btn" onClick={() => navigate('/login')}>
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-message">
        <h2>로드 실패</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!bundle) return <div className="page-message">불러오는 중...</div>;

  const { paper, letters } = bundle;
  const shareLink = `${window.location.origin}${paper.shareUrl}`;
  const unlocked = isOpenDate(paper.openDate);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      setCopied(false);
      alert(shareLink);
    }
  };

  return (
    <div className="paper-page">
      <div className="paper-hero">
        <p className="eyebrow">내 트리</p>
        <h2>{session.user.nickname || session.user.id} 님의 롤링페이퍼</h2>
        <p className="lede">
          링크를 공유해 편지를 모으세요. 공개일은 {paper.openDate} 입니다.
        </p>
        <div className="action-row">
          <button className="primary-btn" onClick={copyShareLink}>
            {copied ? '복사 완료!' : '공유 링크 복사'}
          </button>
          <button className="ghost-btn" onClick={() => navigate(paper.shareUrl)}>
            내 트리로 이동
          </button>
        </div>
        <div className="stat-line">
          <span>총 {letters.length}개의 편지</span>
          <span>공개 상태: {unlocked ? '열림' : '잠금'}</span>
        </div>
      </div>

      <div className="ornament-grid">
        {letters.map((letter) => (
          <OrnamentCard
            key={letter.id}
            letter={letter}
            openDate={paper.openDate}
            linkTo={unlocked ? `/${paper.ownerId}/letters/${letter.id}` : undefined}
          />
        ))}
        {letters.length === 0 && <div className="empty">아직 편지가 없습니다.</div>}
      </div>
    </div>
  );
};

export default MyPage;
