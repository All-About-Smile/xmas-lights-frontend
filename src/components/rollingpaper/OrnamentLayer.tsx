import Bulb from "@/components/scene/Bulb";
import type { BulbItem } from "@/components/scene/types";
import LoadingText from "@/components/common/LoadingText";
import PageArrowButton from "@/components/common/PageArrowButton";

type Slot = {
  left: string;
  top: string;
};

interface Props {
  bulbs: BulbItem[];
  SLOTS: readonly Slot[];
  BULB_IMAGES: Record<string, string>;
  hasPrev: boolean;
  hasNext: boolean;
  loading: boolean;
  pageIndex: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenLetter: (id: string) => void;
}

export default function OrnamentLayer({
  bulbs,
  SLOTS,
  BULB_IMAGES,
  hasPrev,
  hasNext,
  loading,
  pageIndex,
  pageCount,
  onPrev,
  onNext,
  onOpenLetter,
}: Props) {
  return (
    <>
      {SLOTS.map((pos, i) => {
        const bulb = bulbs[i];
        if (!bulb) return null;

        const src = BULB_IMAGES[bulb.bulbKey];
        if (!src) return null;

        return (
          <Bulb
            key={bulb.id}
            left={pos.left}
            top={pos.top}
            src={src}
            nickname={bulb.nickname}
            onClick={() => onOpenLetter(bulb.id)}
          />
        );
      })}

      {/* arrows */}
      {hasPrev && (
        <PageArrowButton
          direction="prev"
          disabled={loading}
          onClick={onPrev}
          className="absolute left-3 top-[55%] -translate-y-1/2"
        />
      )}

      {hasNext && (
        <PageArrowButton
          direction="next"
          disabled={loading}
          onClick={onNext}
          className="absolute right-3 top-[55%] -translate-y-1/2"
        />
      )}

      {/* loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[20] grid place-items-center text-sm text-gray-700 bg-white/20">
          <LoadingText />
        </div>
      )}
    </>
  );
}
