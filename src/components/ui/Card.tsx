import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <section
      className={clsx(
        `
        rounded-lg border border-black/10 
        bg-surface/90 p-6 shadow-lg backdrop-blur
      `,
        className
      )}
    >
      {children}
    </section>
  );
}