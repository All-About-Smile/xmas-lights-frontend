// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/authApi";
import type { MeResponse, LoginRequest } from "../types/auth";
import { tokenStorage } from "../lib/tokenStorage";

type AuthContextValue = {
  user: MeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshMe: () => Promise<void>;
  login: (userid: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = async () => {
    const meRes = await authApi.me();
    setUser(meRes.data.data); // ✅ 래퍼에서 data 꺼내기
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = tokenStorage.getAccessToken();
        if (!token) {
          setUser(null);
          return;
        }
        await refreshMe();
      } catch {
        tokenStorage.removeAccessToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async (userid: string, password: string) => {
    const payload: LoginRequest = { userid, password };
    const loginRes = await authApi.login(payload);

    // ✅ login 응답: { code, message, data: { access_token, token_type } }
    tokenStorage.setAccessToken(loginRes.data.data.access_token);

    await refreshMe();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.removeAccessToken();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      refreshMe,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
