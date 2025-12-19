export const BULB_SHAPES = ["acorn", "dongle", "soap", "charlie", "candle"] as const;
export const BULB_COLORS = ["yellow", "purple", "pink", "green", "blue"] as const;

export type BulbShape = (typeof BULB_SHAPES)[number];
export type BulbColor = (typeof BULB_COLORS)[number];

export type BulbKey = `${BulbShape}_${BulbColor}` | "admin_bulb";

export const BULB_KEYS: BulbKey[] = [
  ...BULB_SHAPES.flatMap((shape) =>
    BULB_COLORS.map((color) => `${shape}_${color}` as BulbKey)
  ),
  "admin_bulb",
];

export const BULB_KEY_SET = new Set<BulbKey>(BULB_KEYS);

export type BulbItem = {
  id: string; // letterId
  bulbKey: BulbKey;
  nickname: string;
};
