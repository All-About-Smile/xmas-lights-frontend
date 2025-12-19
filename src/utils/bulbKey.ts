import { BULB_KEY_SET, type BulbKey } from "@/components/scene/types";

export function toBulbKey(shape: string, color: string): BulbKey | null {
  if (shape === "admin") return "admin_bulb";

  const key = `${shape}_${color}` as BulbKey;

  return BULB_KEY_SET.has(key) ? key : null;
}
