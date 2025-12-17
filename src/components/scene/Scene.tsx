import type { ReactNode } from "react";

import windowBoard from "@/assets/scene/window_cropped.png";
import backgroundBase from "@/assets/scene/background_base_cropped.png";
import backgroundSnow from "@/assets/scene/background_snow_cropped.png";
import windowFrame from "@/assets/scene/window_frame_cropped.png";
import bulbString from "@/assets/scene/bulb_string_cropped.png";

type Props = {
  children?: ReactNode;
};

export default function Scene({ children }: Props) {
  return (
    // ✅ overflow-visible 로 변경
    <div className="relative w-full h-full overflow-visible">
      {/* 1) window (보드판) */}
      <img
        src={windowBoard}
        alt=""
        className="absolute inset-0 w-full h-full object-contain z-[1] pointer-events-none"
      />

      {/* 2~3) 배경 + 눈: window 모양 안에서만 */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          WebkitMaskImage: `url(${windowBoard})`,
          maskImage: `url(${windowBoard})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      >
        <img
          src={backgroundBase}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
        <img
          src={backgroundSnow}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>

      {/* 4) frame */}
      <img
        src={windowFrame}
        alt=""
        className="absolute inset-0 w-full h-full object-contain z-[4] pointer-events-none"
      />

      {/* 5) string */}
      <img
        src={bulbString}
        alt=""
        className="absolute inset-0 w-full h-full object-contain z-[5] pointer-events-none"
        style={{ transform: "scale(1.05)", transformOrigin: "center" }}
      />

      {/* ✅ 6) Overlay Layer (전구/화살표/UI) */}
      <div className="absolute inset-0 z-[6] overflow-visible">
        {children}
      </div>
    </div>
  );
}
