import { useEffect, useMemo, useState } from "react";

import { getTimeUntilOpen } from "@/utils/time";

type WindowHeaderProps = {
  displayName: string;
  className?: string;
  afterOpenMessage?: {
    top: string;
    bottom?: string;
  };
};

export default function WindowHeader({
  displayName,
  className,
  afterOpenMessage,
}: WindowHeaderProps) {
  const { isOpen, daysLeft, hoursLeft, minutesLeft } = getTimeUntilOpen();
  const timeLeftText =
    daysLeft === 0
      ? hoursLeft === 0
        ? `개봉까지 ${minutesLeft}분`
        : `개봉까지 ${hoursLeft}시간 ${minutesLeft}분`
      : `개봉까지 ${daysLeft}일`;

  const options = useMemo(() => {
    if (isOpen) {
      return [
        {
          top: afterOpenMessage?.top ?? "편지💌가 개봉되었어!",
          bottom: afterOpenMessage?.bottom ?? "밝혀진 전구를 확인해 봐~",
        },
      ];
    }

    return [
      {
        top: `${timeLeftText}...`,
        bottom: "지금당장 편지💌 써야겠지?",
      },
      {
        top: `${timeLeftText}!`,
        bottom: "따뜻한 한 줄 남겨볼래?☕",
      },
      {
        top: `${timeLeftText} 남았어.`,
        bottom: "전구💡에 마음을 밝혀줘!",
      },
    ];
  }, [afterOpenMessage?.bottom, afterOpenMessage?.top, isOpen, timeLeftText]);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * options.length));
  }, [options.length, timeLeftText, isOpen]);

  const message = options[messageIndex] ?? options[0];

  return (
    <div className={className}>
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
        {displayName} 님의 창문
      </h1>
      <div className="mt-2 text-base text-neutral-700">{message.top}</div>
      {message.bottom ? (
        <div className="text-base text-neutral-700">{message.bottom}</div>
      ) : null}
    </div>
  );
}
