import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean; // width:100% 여부
}

export default function Button({ children, full = true, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        [
          full ? "w-full" : "",
          "h-14 rounded-xl bg-[#8E2F2F] px-4",
          "text-lg font-ui font-semibold text-white",
          "shadow-lg transition",
          "hover:-translate-y-[1px] hover:bg-[#7A2424]",
          "active:translate-y-0 active:shadow-md",
          "disabled:opacity-60",
        ],
        className
      )}
    >
      {children}
    </button>
  );
}
