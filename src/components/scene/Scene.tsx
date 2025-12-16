import { useMemo, useState } from "react";

import windowBoard from "@/assets/scene/window_cropped.png";
import backgroundBase from "@/assets/scene/background_base_cropped.png";
import backgroundSnow from "@/assets/scene/background_snow_cropped.png";
import windowFrame from "@/assets/scene/window_frame_cropped.png";
import bulbString from "@/assets/scene/bulb_string_cropped.png";

import { BULB_IMAGES } from "./bulbImages";
import { PAGE_SIZE, SLOTS } from "./sceneSlots";
import type { BulbItem } from "./types";

type Props = {
  bulbs: BulbItem[];
  onOpenLetter: (id: string) => void;
};

export default function Scene({ bulbs, onOpenLetter }: Props) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(bulbs.length / PAGE_SIZE));
  const pageBulbs = useMemo(() => {
    const start = page * PAGE_SIZE;
    return bulbs.slice(start, start + PAGE_SIZE);
  }, [bulbs, page]);

  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  return (
    <div className="relative w-full h-full overflow-hidden">
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


      {/* 6) bulbs */}
      <div className="absolute inset-0 z-[6]">
        {SLOTS.map((pos, i) => {
          const bulb = pageBulbs[i];
          if (!bulb) return null;

          const src = BULB_IMAGES[bulb.bulbKey];
          if (!src) return null;

          return (
            <button
              key={bulb.id}
              type="button"
              onClick={() => onOpenLetter(bulb.id)}
              className="absolute -translate-x-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              {/* ✅ scale로 크기 조절 (비율 유지) */}
            <img
                src={src}
                alt=""
                className="w-10 h-auto translate-y-1"
                style={{
                transform: "scale(3)",     // 👈 여기 숫자만 조절
                transformOrigin: "top center",
                }}
            />
            </button>
          );
        })}
      </div>

      {/* 페이지 이동 */}
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-[10] px-2 py-2 rounded bg-white/70 disabled:opacity-30"
      >
        ◀
      </button>

      <button
        type="button"
        disabled={!canNext}
        onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-[10] px-2 py-2 rounded bg-white/70 disabled:opacity-30"
      >
        ▶
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[10] text-sm bg-white/70 px-3 py-1 rounded">
        {page + 1} / {pageCount}
      </div>
    </div>
  );
}
