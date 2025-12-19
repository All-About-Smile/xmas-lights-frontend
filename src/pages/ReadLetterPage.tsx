import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LetterSheet from "@/components/letter/LetterSheet";
import apiClient from "@/lib/apiClient";
import { toBulbKey } from "@/utils/bulbKey";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import { isUnlockedByServerDate } from "@/utils/time"; // ✅ 여기!

type LetterResponse = {
  letter_number: number;
  writer_nickname: string;
  content: string;
  ornament_shape: string;
  ornament_color: string;
  is_event_ornament: boolean;
  created_at: string;
};

export default function ReadLetterPage() {
  const { userid, letter_number } = useParams<{
    userid: string;
    letter_number: string;
  }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [letter, setLetter] = useState<LetterResponse | null>(null);

  useEffect(() => {
    if (!userid || !letter_number) {
      navigate("/home", { replace: true });
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const res = await apiClient.get(
          `/users/${encodeURIComponent(userid)}/letters/${letter_number}`
        );

        // ✅ 서버 Date 헤더 기준 시간 체크 (기존 로직 재사용)
        const dateHeader = res.headers?.date as string | undefined;
        const serverNow = dateHeader ? new Date(dateHeader) : new Date();

        if (!isUnlockedByServerDate(serverNow)) {
          navigate("/home", { replace: true });
          return;
        }

        if (!mounted) return;

        setLetter(res.data.data as LetterResponse);
      } catch (e) {
        console.error("read letter failed:", e);
        navigate("/home", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userid, letter_number, navigate]);

  if (loading || !letter) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#D8D1CE]">
        불러오는 중...
      </div>
    );
  }

  const bulbKey = toBulbKey(letter.ornament_shape, letter.ornament_color);
  const bulbSrc = bulbKey ? BULB_IMAGES[bulbKey] : "";

  return (
    <div className="relative">
      <LetterSheet
        mode="view"
        toName={userid ?? "받는이"}
        fromName={letter.writer_nickname}
        bulbSrc={bulbSrc}
        content={letter.content}
        onBack={() => navigate("/home")}
      />
    </div>
  );
}
