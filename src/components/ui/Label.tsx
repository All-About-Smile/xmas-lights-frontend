interface LabelProps {
  children: React.ReactNode;
}

export default function Label({ children }: LabelProps) {
  return (
    <span className="text-lg font-medium font-ui text-text">
      {children}
    </span>
  );
}