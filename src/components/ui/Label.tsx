interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Label({ children , className}: LabelProps) {
  const baseClass = "text-lg font-medium font-ui text-text";
  return (
    <span className={className ? `${baseClass} ${className}` : baseClass}>
      {children}
    </span>
  );
}