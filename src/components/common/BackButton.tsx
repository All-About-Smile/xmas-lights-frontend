type BackButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`select-none caret-transparent text-lg touch-manipulation rounded-md px-3 py-2 -mx-3 -my-2 transition-colors active:bg-black/15 focus-visible:bg-black/10 ${className ?? ""}`}
    >
      ← 이전
    </button>
  );
}
