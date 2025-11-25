import type { Letter, OrnamentType, PaperBundle, RollingPaper, Session, User } from '../types';

const DEFAULT_OPEN_DATE = '2025-12-25';

type Credentials = { email: string; password: string; nickname?: string };

type CreateLetterInput = {
  writerNickname: string;
  content: string;
  ornamentType: OrnamentType;
  passwordForEdit?: string;
};

type StoredUser = User & { password: string };

const users: StoredUser[] = [
  {
    id: 'aurora',
    email: 'aurora@northpole.com',
    password: 'snowglobe',
    nickname: 'Aurora',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2025-11-01T08:00:00Z',
    shareUrl: '/aurora',
  },
];

const rollingPapers: RollingPaper[] = [
  {
    id: 'paper-aurora',
    ownerId: 'aurora',
    theme: 'evergreen',
    openDate: DEFAULT_OPEN_DATE,
    createdAt: '2025-11-01T08:00:00Z',
    shareUrl: '/aurora',
  },
];

const letters: Letter[] = [
  {
    id: 'letter-1',
    rollingPaperId: 'paper-aurora',
    letterNumber: 1,
    writerNickname: 'Buddy',
    content: '올겨울에도 반짝이는 네가 되어줘! 눈 내리는 밤, 우리가 만든 불빛 아래에서 꼭 다시 만나자.',
    ornamentType: 'star',
    createdAt: '2025-11-15T12:00:00Z',
    isDeleted: false,
    passwordForEdit: 'north',
  },
  {
    id: 'letter-2',
    rollingPaperId: 'paper-aurora',
    letterNumber: 2,
    writerNickname: 'Ginger',
    content: '따뜻한 코코아 한 잔처럼 마음이 녹았으면 좋겠어. 너의 12월이 포근하게 채워지길!',
    ornamentType: 'ginger',
    createdAt: '2025-11-17T18:30:00Z',
    isDeleted: false,
  },
  {
    id: 'letter-3',
    rollingPaperId: 'paper-aurora',
    letterNumber: 3,
    writerNickname: 'Snowy',
    content: '미리보는 크리스마스! 올해도 네가 있어서 정말 든든해. 25일에 함께 읽을 그 순간을 기다릴게.',
    ornamentType: 'snow',
    createdAt: '2025-11-20T09:10:00Z',
    isDeleted: false,
  },
];

const sessions: Record<string, string> = {};

const delay = async (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

const findPaperByUser = (userId: string) => rollingPapers.find((p) => p.ownerId === userId);

export const isOpenDate = (openDate: string) => new Date(openDate).getTime() <= Date.now();

export const bootstrapDemoSession = (): Session | null => {
  const demo = users[0];
  if (!demo) return null;
  const token = `session-${demo.id}`;
  sessions[token] = demo.id;
  return { token, user: stripPassword(demo) };
};

export const login = async ({ email, password }: Credentials): Promise<Session> => {
  await delay();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error('아이디 또는 비밀번호를 확인해주세요.');
  }
  const token = `session-${user.id}-${Date.now()}`;
  sessions[token] = user.id;
  return { token, user: stripPassword(user) };
};

export const signup = async ({ email, password, nickname }: Credentials): Promise<Session> => {
  await delay();
  const exists = users.some((u) => u.email === email);
  if (exists) throw new Error('이미 가입된 이메일입니다.');

  const id = nickname ? nickname.toLowerCase().replace(/\s+/g, '-') : `user-${users.length + 1}`;
  const now = new Date().toISOString();
  const newUser: StoredUser = {
    id,
    email,
    password,
    nickname,
    createdAt: now,
    updatedAt: now,
    shareUrl: `/${id}`,
  };
  users.push(newUser);
  rollingPapers.push({
    id: `paper-${id}`,
    ownerId: id,
    theme: 'evergreen',
    openDate: DEFAULT_OPEN_DATE,
    createdAt: now,
    shareUrl: `/${id}`,
  });
  const token = `session-${id}-${Date.now()}`;
  sessions[token] = id;
  return { token, user: stripPassword(newUser) };
};

export const getMyPaper = async (token: string): Promise<PaperBundle> => {
  await delay(220);
  const userId = sessions[token];
  if (!userId) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  const paper = findPaperByUser(userId);
  if (!paper) throw new Error('롤링페이퍼가 아직 만들어지지 않았습니다.');
  const paperLetters = letters.filter((l) => l.rollingPaperId === paper.id && !l.isDeleted);
  return { paper, letters: paperLetters };
};

export const getPublicPaper = async (userId: string): Promise<PaperBundle> => {
  await delay(180);
  const paper = findPaperByUser(userId);
  if (!paper) throw new Error('해당 사용자의 트리가 없습니다.');
  const paperLetters = letters.filter((l) => l.rollingPaperId === paper.id && !l.isDeleted);
  return { paper, letters: paperLetters };
};

export const getLetterDetail = async (userId: string, letterId: string): Promise<Letter> => {
  await delay(180);
  const paper = findPaperByUser(userId);
  if (!paper) throw new Error('존재하지 않는 트리입니다.');
  const letter = letters.find((l) => l.id === letterId && l.rollingPaperId === paper.id && !l.isDeleted);
  if (!letter) throw new Error('해당 편지를 찾을 수 없습니다.');
  return letter;
};

export const createLetter = async (
  userId: string,
  { writerNickname, content, ornamentType, passwordForEdit }: CreateLetterInput,
): Promise<Letter> => {
  await delay(320);
  const paper = findPaperByUser(userId);
  if (!paper) throw new Error('대상 롤링페이퍼를 찾을 수 없습니다.');
  const nextNumber =
    letters.filter((l) => l.rollingPaperId === paper.id && !l.isDeleted).length + 1;
  const newLetter: Letter = {
    id: createId(),
    rollingPaperId: paper.id,
    letterNumber: nextNumber,
    writerNickname,
    content,
    ornamentType,
    createdAt: new Date().toISOString(),
    isDeleted: false,
    passwordForEdit,
  };
  letters.push(newLetter);
  return newLetter;
};

export const ornamentPalette: Record<OrnamentType, string> = {
  star: '#ffcf54',
  bell: '#ff7b7b',
  candy: '#e14b88',
  snow: '#5ac8fa',
  ginger: '#c56f2e',
};

const stripPassword = (user: StoredUser): User => {
  const { password, ...rest } = user;
  return rest;
};

const createId = () =>
  Array.from(crypto.getRandomValues(new Uint32Array(2)))
    .map((n) => n.toString(16))
    .join('-');
