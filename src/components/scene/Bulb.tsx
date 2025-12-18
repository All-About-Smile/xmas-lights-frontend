type BulbProps = {
  left: string;
  top: string;
  src: string;
  nickname: string;
  onClick: () => void;
};

const BULB_WIDTH = "min(18%, 88px)";
const LABEL_GAP_PX = 2;
export default function Bulb({
  left,
  top,
  src,
  nickname,
  onClick,
}: BulbProps) {
  return (
    <div
      className="absolute"
      style={{
        left,
        top,
        transform: "translate(-50%, -50%)",
        width: BULB_WIDTH,
      }}
    >
      <button type="button" onClick={onClick} className="relative block w-full">
        <img
          src={src}
          alt=""
          draggable={false}
          className="block w-full h-auto"
        />
      </button>

      <div
        className="
          absolute left-1/2 -translate-x-1/2
          max-w-[120px] truncate
          rounded-md bg-white/85 px-2 py-1
          text-[11px] font-semibold text-neutral-900
          shadow pointer-events-none
        "
        style={{ top: `calc(100% + ${LABEL_GAP_PX}px)` }}
        title={nickname}
      >
        {nickname}
      </div>
    </div>
  );
}

