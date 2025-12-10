import { useEffect } from "react";
import NavigationItem from "@/components/navigation/NavigationItem";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

export default function NavDrawer({ open, onClose, userName }: NavDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Dim background */}
      <div
        className={`
          fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-[80%] max-w-[380px]
          bg-surface shadow-lg rounded-l-2xl p-6
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
          font-ui
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg font-bold">
            {userName ? `${userName} 님, 안녕하세요` : "안녕하세요"}
          </p>
          <button
            onClick={onClose}
            className="text-3xl font-bold leading-none px-2"
          >
            ×
          </button>
        </div>

        <div className="border-t border-black/10 my-4"></div>

        {/* Menu List */}
        <nav className="space-y-6 text-lg">
          <NavigationItem>✩ 계정 설정</NavigationItem>
          <NavigationItem>✩ 내 창문 보러가기</NavigationItem>
          {/* <NavigationItem>✩ 즐겨찾기 목록</NavigationItem> */}
        </nav>

        <div className="absolute bottom-6 left-6 text-sm text-muted">
          v.1.0.0
        </div>
      </aside>
    </>
  );
}
