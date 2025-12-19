type HomeButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

export default function HomeButton({
  onClick,
  ariaLabel = "메인으로",
  className = "",
}: HomeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 ${className}`.trim()}
    >
      <img src="/Home.png" alt="" draggable={false} className="h-7 w-7" />
    </button>
  );
}
