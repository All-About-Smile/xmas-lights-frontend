import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrnamentCard from '../components/OrnamentCard';
import { getLetterDetail, getPublicPaper, isOpenDate } from '../services/mockApi';
import type { Letter, PaperBundle } from '../types';

const LetterDetailPage = () => {
  const { userId, letterId } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState<PaperBundle | null>(null);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId || !letterId) return;
    Promise.all([getPublicPaper(userId), getLetterDetail(userId, letterId)])
      .then(([paperBundle, letterData]) => {
        setBundle(paperBundle);
        setLetter(letterData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : '편지를 불러올 수 없습니다.'));
  }, [userId, letterId]);

  if (error) {
    return (
      <div className="page-message">
        <h2>편지 조회 실패</h2>
        <p>{error}</p>
        <button className="ghost-btn" onClick={() => navigate(`/${userId || ''}`)}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!bundle || !letter) return <div className="page-message">불러오는 중...</div>;

  const unlocked = isOpenDate(bundle.paper.openDate);

  return (
    <div className="paper-page">
      <div className="paper-hero">
        <p className="eyebrow">편지 상세</p>
        <h2>{userId} 님에게 온 #{letter.letterNumber}</h2>
        <p className="lede">
          {unlocked ? '공개된 편지입니다.' : `${bundle.paper.openDate} 이후에 내용을 볼 수 있어요.`}
        </p>
        <button className="ghost-btn" onClick={() => navigate(`/${userId}`)}>
          목록으로
        </button>
      </div>
      <OrnamentCard letter={letter} openDate={bundle.paper.openDate} />
    </div>
  );
};

export default LetterDetailPage;
