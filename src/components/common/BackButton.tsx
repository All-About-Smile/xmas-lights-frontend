import { useRef } from "react";

type BackButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function BackButton({ onClick, className }: BackButtonProps) {
  const pointerHandledRef = useRef(false);

  const handlePointerUp = () => {
    pointerHandledRef.current = true;
    onClick?.();
    setTimeout(() => {
      pointerHandledRef.current = false;
    }, 0);
  };

  const handleClick = () => {
    if (pointerHandledRef.current) return;
    onClick?.();
  };

  return (
    <button
      type="button"
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      className={`select-none caret-transparent text-lg touch-manipulation ${className ?? ""}`}
    >
      ← 이전
    </button>
  );
}
