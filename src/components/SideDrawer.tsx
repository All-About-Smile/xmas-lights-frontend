import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function SideDrawer({ open, onClose }: SideDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("로그아웃 실패:", e);
    }
  };

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[80%] max-w-[360px]
          bg-[#F7F1E6] shadow-xl transition-transform duration-200
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <div className="text-lg font-semibold">
              {isAuthenticated
                ? `${user?.userid ?? "사용자"} 님, 안녕하세요`
                : "안녕하세요"}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-2xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="mt-6 h-px bg-black/10" />

        {/* menu */}
        <nav className="px-6 py-6 text-lg font-medium text-neutral-900">
          <Link
            to="/account/settings"
            className="block py-4"
            onClick={onClose}
          >
            계정 설정
          </Link>

          <Link
            to="/"
            className="block py-4"
            onClick={onClose}
          >
            내 창문 보러가기
          </Link>
        </nav>

        <div className="mt-6 h-px bg-black/10" />

        <div>
          {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="mt-6 px-6 text-lg text-neutral-500 underline"
              >
                로그아웃
              </button>
            )}
        </div>
      </aside>
    </>
  );
}
