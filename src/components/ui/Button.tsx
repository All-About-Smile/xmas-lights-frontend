import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean; // width:100% 여부
}

export default function Button({ children, full = true, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        `
        ${full ? "w-full" : ""}
        rounded-lg bg-primary px-4 py-4
        text-lg font-ui font-semibold text-white
        shadow-lg transition
        hover:-translate-y-[1px] hover:brightness-105
        active:translate-y-0 active:shadow-md
      `,
        className
      )}
    >
      {children}
    </button>
  );
}
