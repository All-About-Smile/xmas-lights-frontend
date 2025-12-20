type PageArrowButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export default function PageArrowButton({
  direction,
  onClick,
  disabled,
  className,
}: PageArrowButtonProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`z-[10] px-2 py-2 rounded bg-white/70 disabled:opacity-30 ${className ?? ""}`}
    >
      {isPrev ? "◀" : "▶"}
    </button>
  );
}
