import { useState } from "react";
import NavDrawer from "@/components/navigation/NavDrawer";
import HamburgerButton from "@/components/navigation/HamburgerButton";

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-bg px-5 py-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-xs font-ui text-primary">밝혀줘! 내 X-mas 전구</p>

        <HamburgerButton onClick={() => setOpen(true)} />
      </div>

      {/* Example main content */}
      <h1 className="mt-10 text-3xl font-ui font-bold text-center">
        밝혀줘! 내 X-mas 전구
      </h1>

      {/* Drawer */}
      <NavDrawer
        open={open}
        onClose={() => setOpen(false)}
        userName="루키아쉿해"
      />
    </main>
  );
}
