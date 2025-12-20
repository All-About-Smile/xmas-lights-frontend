import menuIcon from "@/assets/icons/Menu.png";
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
      <img src={menuIcon} alt="" draggable={false} className="h-7 w-7" />
    </button>
  );
}
