type PageIndicatorProps = {
  pageIndex: number;
  pageCount?: number;
  className?: string;
};

export default function PageIndicator({
  pageIndex,
  pageCount,
  className,
}: PageIndicatorProps) {
  const resolvedCount =
    typeof pageCount === "number" && Number.isFinite(pageCount)
      ? pageCount
      : null;
  const displayIndex = resolvedCount === 0 ? 0 : pageIndex;
  const displayCount = resolvedCount === null ? "?" : resolvedCount;

  return (
    <div
      className={`text-sm bg-white/70 px-3 py-1 rounded ${className ?? ""}`}
    >
      {displayIndex} / {displayCount}
    </div>
  );
}
