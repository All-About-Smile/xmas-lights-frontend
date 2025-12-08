import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        `
        w-full rounded-md border border-black/10 bg-white
        px-4 py-3 text-base font-letter
        shadow-inner shadow-white/40 outline-none transition
        focus:border-primary focus:ring-4 focus:ring-primary/15
      `,
        className
      )}
    />
  );
}
