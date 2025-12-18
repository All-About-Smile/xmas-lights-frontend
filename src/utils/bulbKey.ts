import type { BulbKey } from "@/components/scene/types";

export function toBulbKey(shape: string, color: string): BulbKey | null {
  if (shape === "admin") return "admin_bulb";

  const key = `${shape}_${color}` as BulbKey;

  const VALID_KEYS: BulbKey[] = [
    "acorn_yellow",
    "acorn_purple",
    "acorn_pink",
    "acorn_green",
    "acorn_blue",
    "dongle_yellow",
    "dongle_purple",
    "dongle_pink",
    "dongle_green",
    "dongle_blue",
    "soap_yellow",
    "soap_purple",
    "soap_pink",
    "soap_green",
    "soap_blue",
    "charlie_yellow",
    "charlie_purple",
    "charlie_pink",
    "charlie_green",
    "charlie_blue",
    "candle_yellow",
    "candle_purple",
    "candle_pink",
    "candle_green",
    "candle_blue",
    "admin_bulb",
  ];

  return VALID_KEYS.includes(key) ? key : null;
}
