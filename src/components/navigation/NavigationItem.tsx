interface NavigationItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function NavigationItem({ children, onClick }: NavigationItemProps) {
  return (
    <button
      onClick={onClick}
      className="
        block w-full text-left py-2 rounded-md px-2
        transition active:scale-[0.98] active:opacity-70 active:bg-black/5
        font-ui
      "
    >
      {children}
    </button>
  );
}
