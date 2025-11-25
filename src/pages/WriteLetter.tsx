import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLetter } from '../services/mockApi';
import type { OrnamentType } from '../types';
import type { FormEvent } from 'react';

const ornamentOptions: { value: OrnamentType; label: string }[] = [
  { value: 'star', label: '별' },
  { value: 'bell', label: '종' },
  { value: 'candy', label: '캔디' },
  { value: 'snow', label: '눈송이' },
  { value: 'ginger', label: '진저브레드' },
];

const WriteLetterPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [writerNickname, setWriterNickname] = useState('');
  const [content, setContent] = useState('');
  const [ornamentType, setOrnamentType] = useState<OrnamentType>('star');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    setError('');
    try {
      await createLetter(userId, {
        writerNickname: writerNickname || '익명',
        content,
        ornamentType,
        passwordForEdit: password || undefined,
      });
      navigate(`/${userId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '편지 작성에 실패했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mobile-screen letter-screen">
      <div className="top-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 이전
        </button>
        <div className="menu-btn">≡</div>
      </div>

      <div className="letter-header">
        <h1>메세지를 적어주세요</h1>
        <div className="ornament-preview" data-type={ornamentType} />
      </div>

      <form onSubmit={handleSubmit} className="letter-form">
        <label className="field large-box">
          <textarea
            required
            minLength={4}
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="사랑하는 ~~이야&#10;올 한해도 즐거웠어&#10;늘 행복하고&#10;즐거운 일이&#10;가득하길 바랄게~"
          />
        </label>

        <label className="field from-box">
          <span>from.</span>
          <input
            value={writerNickname}
            onChange={(e) => setWriterNickname(e.target.value)}
            placeholder="송구리당당"
          />
        </label>

        <div className="field pill-row">
          {ornamentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`pill ${ornamentType === option.value ? 'active' : ''}`}
              onClick={() => setOrnamentType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="field">
          <span>수정용 비밀번호 (선택)</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 남겨두면 수정할 수 있어요."
          />
        </label>

        {error && <div className="error-banner">{error}</div>}

        <button className="primary-btn lg block" type="submit" disabled={busy}>
          {busy ? '전송 중...' : '다음으로'}
        </button>
      </form>
    </div>
  );
};

export default WriteLetterPage;
