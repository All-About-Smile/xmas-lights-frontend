export type OrnamentType = 'star' | 'bell' | 'candy' | 'snow' | 'ginger';

export type User = {
  id: string;
  email: string;
  passwordHash?: string;
  nickname?: string;
  createdAt: string;
  updatedAt: string;
  shareUrl: string;
};

export type RollingPaper = {
  id: string;
  ownerId: string;
  theme: string;
  openDate: string;
  createdAt: string;
  shareUrl: string;
};

export type Letter = {
  id: string;
  rollingPaperId: string;
  letterNumber: number;
  writerNickname: string;
  content: string;
  ornamentType: OrnamentType;
  createdAt: string;
  isDeleted: boolean;
  passwordForEdit?: string;
};

export type Session = {
  token: string;
  user: User;
};

export type PaperBundle = {
  paper: RollingPaper;
  letters: Letter[];
};
