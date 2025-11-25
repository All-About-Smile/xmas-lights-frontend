import { Link } from 'react-router-dom';
import type { Letter } from '../types';
import { isOpenDate, ornamentPalette } from '../services/mockApi';

type Props = {
  letter: Letter;
  openDate: string;
  linkTo?: string;
};

const ornamentName: Record<Letter['ornamentType'], string> = {
  star: '별',
  bell: '종',
  candy: '캔디',
  snow: '눈송이',
  ginger: '진저브레드',
};

const OrnamentCard = ({ letter, openDate, linkTo }: Props) => {
  const unlocked = isOpenDate(openDate);
  const body = (
    <div className="ornament-card" style={{ borderColor: ornamentPalette[letter.ornamentType] }}>
      <div className="ornament-top">
        <span className="ornament-dot" style={{ background: ornamentPalette[letter.ornamentType] }} />
        <span className="ornament-type">{ornamentName[letter.ornamentType]}</span>
        <span className="ornament-number">#{letter.letterNumber}</span>
      </div>
      <p className={`ornament-content ${unlocked ? '' : 'blurred'}`}>
        {unlocked ? letter.content : '12월 25일에 열립니다.'}
      </p>
      <div className="ornament-bottom">
        <span className="ornament-writer">{letter.writerNickname || '익명'}</span>
        <span className="ornament-date">{new Date(letter.createdAt).toLocaleDateString()}</span>
      </div>
      {!unlocked && <div className="lock-banner">🔒 크리스마스에 공개</div>}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="ornament-link">
        {body}
      </Link>
    );
  }

  return body;
};

export default OrnamentCard;
