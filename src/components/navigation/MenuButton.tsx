type MenuButtonProps = {
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

export default function MenuButton({
  onClick,
  ariaLabel = "메뉴 열기",
  className = "",
}: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 ${className}`.trim()}
    >
      <img src="/Menu.png" alt="" draggable={false} className="h-7 w-7" />
    </button>
  );
}
