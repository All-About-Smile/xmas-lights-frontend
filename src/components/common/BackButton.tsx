type BackButtonProps = {
  onClick?: () => void;
  className?: string;
};

export default function BackButton({ onClick, className }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-lg ${className ?? ""}`}
    >
      ← 이전
    </button>
  );
}
