import clsx from "clsx";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={clsx(
        `
        w-full min-h-[96px] resize-y
        rounded-md border border-black/10 bg-white
        px-4 py-3 text-base font-letter
        shadow-inner shadow-white/40 outline-none transition
        focus:border-primary focus:ring-4 focus:ring-primary/15
      `,
        className
      )}
    />
  );
}