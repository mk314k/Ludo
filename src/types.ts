export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

export const LUDO_COLORS: LudoColor[] = ['red', 'green', 'yellow', 'blue'];

export const COLOR_HEX: Record<LudoColor, string> = {
  red: '#d6392e',
  green: '#2a8540',
  yellow: '#dca024',
  blue: '#26689c',
};

export const COLOR_SOFT_HEX: Record<LudoColor, string> = {
  red: '#f9dcd9',
  green: '#d8f0de',
  yellow: '#fbf0cf',
  blue: '#d6e8f7',
};

export const COLOR_LABELS: Record<LudoColor, string> = {
  red: 'Crimson House',
  green: 'Emerald House',
  yellow: 'Amber House',
  blue: 'Sapphire House',
};

/**
 * Token progress values:
 *   -1     = inside home yard (StartPad)
 *   0..50  = 51 steps around the outer 52-cell main track relative to player's start cell
 *   51..55 = 5 steps inside the player's colored home-stretch column
 *   56     = reached center home triangle (finished!)
 */
export interface LudoToken {
  id: string;
  color: LudoColor;
  tokenIdx: 0 | 1 | 2 | 3;
  step: number;
}

export type PlayerControlType = 'human' | 'bot-aggressive' | 'bot-safe' | 'bot-balanced';

export interface LudoPlayer {
  color: LudoColor;
  name: string;
  control: PlayerControlType;
  finishedCount: number;
  captures: number;
  rank?: number;
}

export type TurnStage = 'waiting-for-roll' | 'waiting-for-move' | 'animating' | 'game-over';

export interface LudoMoveOption {
  tokenId: string;
  tokenIdx: 0 | 1 | 2 | 3;
  fromStep: number;
  toStep: number;
  willCapture?: boolean;
  willFinish?: boolean;
  landsOnStar?: boolean;
}

export interface GridCoord {
  row: number;
  col: number;
}
