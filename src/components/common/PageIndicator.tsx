type PageIndicatorProps = {
  pageIndex: number;
  pageCount: number;
  className?: string;
};

export default function PageIndicator({
  pageIndex,
  pageCount,
  className,
}: PageIndicatorProps) {
  return (
    <div
      className={`text-sm bg-white/70 px-3 py-1 rounded ${className ?? ""}`}
    >
      {pageIndex} / {pageCount}
    </div>
  );
}
