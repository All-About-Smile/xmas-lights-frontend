import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrnamentCard from '../components/OrnamentCard';
import { getPublicPaper, isOpenDate } from '../services/mockApi';
import type { PaperBundle } from '../types';

const PublicPaperPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<PaperBundle | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    getPublicPaper(userId)
      .then((data) => setBundle(data))
      .catch((err) => setError(err instanceof Error ? err.message : '불러오기에 실패했습니다.'));
  }, [userId]);

  if (error) {
    return (
      <div className="page-message">
        <h2>트리를 찾을 수 없어요</h2>
        <p>{error}</p>
        <button className="ghost-btn" onClick={() => navigate('/')}>
          홈으로 가기
        </button>
      </div>
    );
  }

  if (!bundle) return <div className="page-message">불러오는 중...</div>;

  const { paper, letters } = bundle;
  const unlocked = isOpenDate(paper.openDate);

  return (
    <div className="mobile-screen window-screen">
      <div className="top-actions">
        <div />
        <div className="menu-btn">≡</div>
      </div>

      <div className="paper-hero soft">
        <p className="eyebrow">밝혀줘! 내 X-mas 전구</p>
        <h2>{userId} 님의 창문</h2>
        <p className="lede">
          {unlocked
            ? '크리스마스가 되어 모든 편지가 열렸어요.'
            : `${paper.openDate}에 공개됩니다. 지금도 새 편지를 받을 수 있어요!`}
        </p>
      </div> 

      <div className="window-area">  
        <div className="window-flakes" aria-hidden> 
          {Array.from({ length: 48 }).map((_, i) => (
            <span
              key={i}
              className="flake"
              style={
                {
                  left: `${(i * 23) % 100}%`,
                  '--dur': `${14 + (i % 8)}s`,
                  '--delay': `${(i * 0.47) % 18}s`,
                  '--sx': `${((i % 10) - 5) * 1.2}%`,
                  '--ex': `${(((i + 6) % 10) - 5) * 1.2}%`,
                  width: `${7 + (i % 3)}px`,
                  height: `${7 + (i % 3)}px`,
                } as React.CSSProperties
              }
            />
          ))} 
        </div> 
        <div className="window-snow" aria-hidden />  
        <div className="window-ground" aria-hidden />  
        <div className="window-frame" aria-label="arched window frame">  
          <div className="window-bg-top" aria-hidden />  
          <div className="window-bg-bottom" aria-hidden /> 
          <div className="window-frame-top" /> 
          <div className="window-frame-bottom" /> 
          <div className="window-bars"> 
            <span className="window-bar vertical" /> 
            <span className="window-bar horizontal top" /> 
            <span className="window-bar horizontal mid" /> 
            <span className="window-bar horizontal low" /> 
            <span className="window-bar diag left" /> 
            <span className="window-bar diag right" /> 
          </div> 
        </div> 
      </div>  

      <button className="primary-btn lg block" onClick={() => navigate(`/${userId}/write`)}>
        창문 꾸미기
      </button>

      <div className="ornament-grid compact">
        {letters.map((letter) => (
          <OrnamentCard
            key={letter.id}
            letter={letter}
            openDate={paper.openDate}
            linkTo={`/${userId}/letters/${letter.id}`}
          />
        ))}
        {letters.length === 0 && (
          <div className="empty">아직 편지가 없어요. 첫 번째 오너먼트를 달아주세요.</div>
        )}
      </div>
    </div>
  );
};

export default PublicPaperPage;
