export type LoginRequest = {
  userid: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type RegisterRequest = {
  userid: string;
  email: string;
  password: string;
};

export type MeResponse = {
  id: number;
  email: string;
};
