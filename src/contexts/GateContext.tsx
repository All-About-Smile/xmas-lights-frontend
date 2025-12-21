import { createContext, useContext, useMemo, useState } from "react";
import { isUnlockedByServerDate } from "@/utils/time";

type GateContextValue = {
  serverDate: Date | null;
  setServerDate: (d: Date | null) => void;
  isWriteLocked: boolean; // 12/25 이후 true (작성/수정/삭제 막기)
};

const GateContext = createContext<GateContextValue | null>(null);

export function GateProvider({ children }: { children: React.ReactNode }) {
  const [serverDate, setServerDate] = useState<Date | null>(null);

  const isWriteLocked = useMemo(() => {
    if (!serverDate) return false; // serverDate 아직 없으면 일단 false (가드에서 로딩 처리)
    return isUnlockedByServerDate(serverDate);
  }, [serverDate]);

  const value = useMemo(
    () => ({ serverDate, setServerDate, isWriteLocked }),
    [serverDate, isWriteLocked]
  );

  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
}

export function useGate() {
  const ctx = useContext(GateContext);
  if (!ctx) throw new Error("useGate must be used within GateProvider");
  return ctx;
}
