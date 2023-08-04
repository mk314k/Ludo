import { GridCoord, LudoColor } from './types';

export const BOARD_GRID_SIZE = 15;

/**
 * The 52-cell clockwise outer track on a standard 15x15 Ludo grid (rows 0..14, cols 0..14).
 * Index 0 is Red's starting square at (row 1, col 8).
 */
export const MAIN_TRACK_COORDS: GridCoord[] = [
  // Top arm right column going down (0..4)
  { row: 1, col: 8 },
  { row: 2, col: 8 },
  { row: 3, col: 8 },
  { row: 4, col: 8 },
  { row: 5, col: 8 },
  // Right arm top row going right (5..10)
  { row: 6, col: 9 },
  { row: 6, col: 10 },
  { row: 6, col: 11 },
  { row: 6, col: 12 },
  { row: 6, col: 13 },
  { row: 6, col: 14 },
  // Right arm turn (11..12)
  { row: 7, col: 14 },
  { row: 8, col: 14 },
  // Right arm bottom row going left (13..17) — Green start is index 13 (row 8, col 13)
  { row: 8, col: 13 },
  { row: 8, col: 12 },
  { row: 8, col: 11 },
  { row: 8, col: 10 },
  { row: 8, col: 9 },
  // Bottom arm right column going down (18..23)
  { row: 9, col: 8 },
  { row: 10, col: 8 },
  { row: 11, col: 8 },
  { row: 12, col: 8 },
  { row: 13, col: 8 },
  { row: 14, col: 8 },
  // Bottom arm turn (24..25)
  { row: 14, col: 7 },
  { row: 14, col: 6 },
  // Bottom arm left column going up (26..30) — Yellow start is index 26 (row 13, col 6)
  { row: 13, col: 6 },
  { row: 12, col: 6 },
  { row: 11, col: 6 },
  { row: 10, col: 6 },
  { row: 9, col: 6 },
  // Left arm bottom row going left (31..36)
  { row: 8, col: 5 },
  { row: 8, col: 4 },
  { row: 8, col: 3 },
  { row: 8, col: 2 },
  { row: 8, col: 1 },
  { row: 8, col: 0 },
  // Left arm turn (37..38)
  { row: 7, col: 0 },
  { row: 6, col: 0 },
  // Left arm top row going right (39..43) — Blue start is index 39 (row 6, col 1)
  { row: 6, col: 1 },
  { row: 6, col: 2 },
  { row: 6, col: 3 },
  { row: 6, col: 4 },
  { row: 6, col: 5 },
  // Top arm left column going up (44..49)
  { row: 5, col: 6 },
  { row: 4, col: 6 },
  { row: 3, col: 6 },
  { row: 2, col: 6 },
  { row: 1, col: 6 },
  { row: 0, col: 6 },
  // Top arm turn (50..51)
  { row: 0, col: 7 },
  { row: 0, col: 8 },
];

export const START_TRACK_INDEX: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

/**
 * The 8 safe star squares on the 52-cell outer loop:
 * 4 colored starting squares (0, 13, 26, 39) + 4 mid-arm star squares (8, 21, 34, 47).
 */
export const SAFE_TRACK_INDICES: Set<number> = new Set([0, 8, 13, 21, 26, 34, 39, 47]);
