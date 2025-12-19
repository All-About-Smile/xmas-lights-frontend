import type { ButtonHTMLAttributes } from "react";

import infoIcon from "../assets/icons/Info.png";

type InfoButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ariaLabel: string;
};

export default function InfoButton({
  ariaLabel,
  className,
  ...buttonProps
}: InfoButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={`grid h-9 w-9 place-items-center ${className ?? ""}`}
      {...buttonProps}
    >
      <img src={infoIcon} alt="" className="h-5 w-5" />
    </button>
  );
}
