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
  const { isOpen, daysLeft} = getTimeUntilOpen();
  const timeLeftText = `개봉까지 ${daysLeft + 1}일`;

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
        top: `${timeLeftText}..🎅`,
        bottom: "어떤 편지💌가 날 기다릴까?",
      },
      {
        top: `${timeLeftText}!🎅`,
        bottom: "창문이 예뻐지고 있어~☕",
      },
      {
        top: `${timeLeftText} 남았어🎅`,
        bottom: "어떤 전구💡가 달릴까?",
      },
      {
        top: `${timeLeftText} 남았어🎅`,
        bottom: "곧... 창문에 담긴 마음들이 열리겠지!?",
      },
      {
        top: `${timeLeftText} 남았어🎅`,
        bottom: "그동안 창문은 전구들로 채워질 거라구~!",
      },
      {
        top: `${timeLeftText} 남았어🎅`,
        bottom: "기다리는 시간이 이렇게 좋은 거였나 봐...ㅎㅎ",
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
