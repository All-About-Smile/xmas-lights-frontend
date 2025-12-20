type ServiceTitleProps = {
  className?: string;
};

export default function ServiceTitle({ className }: ServiceTitleProps) {
  return (
    <div className={`text-base font-medium text-neutral-800 ${className ?? ""}`}>
      밝혀줘! 내 X-mas 전구
    </div>
  );
}
