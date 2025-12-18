type BulbProps = {
  left: string;
  top: string;
  src: string;
  nickname: string;
  onClick: () => void;
};

const BULB_SCALE = 2.2; //전구 크기
const LABEL_OFFSET_PX = 56; //전구 닉네임 라벨 위치 조정

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
      }}
    >
      <button type="button" onClick={onClick} className="relative block">
        <img
          src={src}
          alt=""
          className="block w-10 h-auto"
          style={{
            transform: `scale(${BULB_SCALE})`,
            transformOrigin: "top center",
          }}
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
        style={{ top: LABEL_OFFSET_PX }}
        title={nickname}
      >
        {nickname}
      </div>
    </div>
  );
}
