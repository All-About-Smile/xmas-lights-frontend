import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useGate } from "@/contexts/GateContext";
import { getUserLetters } from "@/api/letterApi"; // serverDate 포함 응답
// PAGE_SIZE 없어도 됨. 우리는 limit=1만 쓸 거라

export default function WriteLockGuard({ children }: { children: ReactElement }) {
  const { userid } = useParams<{ userid: string }>();
  const { serverDate, setServerDate, isWriteLocked } = useGate();
  const [status, setStatus] = useState<"idle" | "loading" | "fail">("idle");

  useEffect(() => {
    if (serverDate) return;           // 이미 있으면 끝
    if (!userid) return;              // userid 없으면 아래에서 404

    let mounted = true;

    (async () => {
      try {
        setStatus("loading");

        // ✅ serverDate 확보 목적: 최소 호출
        const result = await getUserLetters({ userid, limit: 1, offset: 0 });

        if (!mounted) return;

        const d = result.serverDate ? new Date(result.serverDate as any) : null;
        setServerDate(d && !Number.isNaN(d.getTime()) ? d : null);

        setStatus("idle");
      } catch {
        if (!mounted) return;
        setStatus("fail");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [serverDate, userid, setServerDate]);

  // 잘못된 접근
  if (!userid) return <Navigate to="/404" replace />;

  // 아직 serverDate 없으면: 가져오는 중이면 로딩, 실패면 404 (무한 로딩 방지)
  if (!serverDate) {
    if (status === "fail") return <Navigate to="/404" replace />;
    return <div className="p-6">Loading...</div>;
  }

  // ✅ 시간 판단: 12/25 이후면 작성 접근 차단
  if (isWriteLocked) return <Navigate to="/404" replace />;

  // ✅ 나머지는 허용
  return children;
}
