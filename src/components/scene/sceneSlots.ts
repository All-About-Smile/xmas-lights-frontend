export const PAGE_SIZE = 8;

/**
 * 3 / 2 / 3
 * - 전선 3줄에 맞춘 초기 좌표
 * - HomePage aspect를 9/13으로 맞춘 뒤 조정해야 안정적
 */
export const SLOTS = [
  // row 1 (3) : 1번째 전선(상단)
  { left: "28%", top: "37.5%" },
  { left: "50%", top: "36%" },
  { left: "72%", top: "32%" },

  // row 2 (2) : 2번째 전선(중단)
  { left: "36%", top: "62%" },
  { left: "62%", top: "58.5%" },

  // row 3 (3) : 3번째 전선(하단)
  { left: "26%", top: "86.5%" },
  { left: "50%", top: "85%" },
  { left: "74%", top: "81%" },
] as const;
