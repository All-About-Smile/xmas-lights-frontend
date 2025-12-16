export const PAGE_SIZE = 8;

/**
 * 3 / 2 / 3
 * - 전선 3줄에 맞춘 초기 좌표
 * - HomePage aspect를 9/13으로 맞춘 뒤 조정해야 안정적
 */
export const SLOTS = [
  // row 1 (3) : 1번째 전선(상단)
  { left: "32%", top: "20%" },
  { left: "50%", top: "18%" },
  { left: "68%", top: "14%" },

  // row 2 (2) : 2번째 전선(중단)
  { left: "40%", top: "44%" },
  { left: "60%", top: "38%" },

  // row 3 (3) : 3번째 전선(하단)
  { left: "30%", top: "68%" },
  { left: "50%", top: "66%" },
  { left: "70%", top: "62%" },
] as const;
