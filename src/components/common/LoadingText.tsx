type LoadingTextProps = {
  text?: string;
  className?: string;
};

export default function LoadingText({
  text = "불러오는 중...",
  className,
}: LoadingTextProps) {
  return (
    <span className={`select-none caret-transparent ${className ?? ""}`}>
      {text}
    </span>
  );
}
