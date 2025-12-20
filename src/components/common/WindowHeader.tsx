import { useEffect, useMemo, useState } from "react";

import { getDaysUntilOpen } from "@/utils/time";

type WindowHeaderProps = {
  displayName: string;
  className?: string;
};

export default function WindowHeader({
  displayName,
  className,
}: WindowHeaderProps) {
  const daysLeft = getDaysUntilOpen();
  const options = useMemo(
    () => [
      {
        top: `개봉까지 ${daysLeft}일 남음...`,
        bottom: "지금당장 편지💌 써야겠지?",
      },
      {
        top: `개봉까지 ${daysLeft}일!`,
        bottom: "따뜻한 한 줄 남겨볼래?☕",
      },
      {
        top: `개봉까지 ${daysLeft}일 남았어.`,
        bottom: "전구💡에 마음을 밝혀줘!",
      },
    ],
    [daysLeft]
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * options.length));
  }, [options.length, daysLeft]);

  const message = options[messageIndex] ?? options[0];

  return (
    <div className={className}>
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
        {displayName} 님의 창문
      </h1>
      <div className="mt-2 text-base text-neutral-700">{message.top}</div>
      <div className="text-base text-neutral-700">{message.bottom}</div>
    </div>
  );
}
