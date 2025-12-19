import { useNavigate } from "react-router-dom";

type HomeButtonProps = {
  onClick?: () => void;
  to?: string;
  ariaLabel?: string;
  className?: string;
};

export default function HomeButton({
  onClick,
  to,
  ariaLabel = "메인으로",
  className = "",
}: HomeButtonProps) {
  const navigate = useNavigate();
  const baseClass = `p-2 ${className}`.trim();

  const handleClick = () => {
    // custom onClick 먼저 실행
    onClick?.();
    // to가 있으면 내비게이트
    if (to) {
      navigate(to);
    }
  };

  return (
    <button type="button" onClick={handleClick} aria-label={ariaLabel} className={baseClass}>
      <img src="/Home.png" alt="" draggable={false} className="h-7 w-7" />
    </button>
  );
}
