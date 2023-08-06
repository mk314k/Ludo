import { StateVarList, StyleVar } from 'statebinderk';
import { getTokenBoardCoord } from './ludoBoardData';
import { COLOR_HEX, LUDO_COLORS, LudoColor, LudoToken } from './types';

const CELL_SIZE = 40;

export interface TokenVisualBinding {
  px: number;
  py: number;
  scale: number;
  selectable: boolean;
}

export const DICE_PIP_PATTERNS: number[][] = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0], // 1
  [0, 0, 1, 0, 0, 0, 1, 0, 0], // 2
  [0, 0, 1, 0, 1, 0, 1, 0, 0], // 3
  [1, 0, 1, 0, 0, 0, 1, 0, 1], // 4
  [1, 0, 1, 0, 1, 0, 1, 0, 1], // 5
  [1, 0, 1, 1, 0, 1, 1, 0, 1], // 6
];

export class LudoBinder {
  public readonly dicePips: StateVarList<number>;
  public readonly diceBorderColor: StyleVar<string>;
  public readonly tokenPositions: StateVarList<TokenVisualBinding>;
  private readonly tokenIndexMap: Map<string, number> = new Map();

  public constructor() {
    const pipInit = Array.from({ length: 9 }, (_, idx) => ({
      id: `dot-${idx}`,
      state: DICE_PIP_PATTERNS[0][idx],
    }));

    this.dicePips = new StateVarList<number>(pipInit, (el, visible) => {
      if (visible === 1) {
        el.classList.add('visible');
        el.classList.remove('invisible');
      } else {
        el.classList.add('invisible');
        el.classList.remove('visible');
      }
    });

    this.diceBorderColor = new StyleVar<string>(
      COLOR_HEX.red,
      'dice-box',
      'borderColor'
    );

    const tokenInit: Array<{ id: string; state: TokenVisualBinding }> = [];
    for (const color of LUDO_COLORS) {
      for (let i = 0; i < 4; i++) {
        const tIdx = i as 0 | 1 | 2 | 3;
        const coord = getTokenBoardCoord(color, tIdx, -1);
        const domId = `token-${color}-${i}`;
        this.tokenIndexMap.set(domId, tokenInit.length);
        tokenInit.push({
          id: domId,
          state: {
            px: coord.col * CELL_SIZE,
            py: coord.row * CELL_SIZE,
            scale: 1,
            selectable: false,
          },
        });
      }
    }

    this.tokenPositions = new StateVarList<TokenVisualBinding>(
      tokenInit,
      (el, st) => {
        el.setAttribute(
          'transform',
          `translate(${st.px.toFixed(1)}, ${st.py.toFixed(1)}) scale(${st.scale.toFixed(2)})`
        );
        const pulse = el.querySelector('.token-pulse-ring');
        if (st.selectable) {
          el.classList.add('token-selectable');
          pulse?.setAttribute('opacity', '1');
        } else {
          el.classList.remove('token-selectable');
          pulse?.setAttribute('opacity', '0');
        }
      }
    );
  }

  public syncDice(value: number, activeColor: LudoColor): void {
    const clamped = Math.max(1, Math.min(6, value));
    const pattern = DICE_PIP_PATTERNS[clamped - 1];
    this.dicePips.listTransition(pattern);
    this.diceBorderColor.transition(COLOR_HEX[activeColor]);

    const diceBox = document.getElementById('dice-box');
    if (diceBox) {
      diceBox.classList.remove('dice-rolling');
      void diceBox.offsetWidth;
      diceBox.classList.add('dice-rolling');
    }
  }

  public syncTokens(tokens: LudoToken[], selectableIds: Set<string> = new Set()): void {
    const cellGroups = new Map<string, LudoToken[]>();
    for (const token of tokens) {
      const base = getTokenBoardCoord(token.color, token.tokenIdx, token.step);
      const key = `${base.row.toFixed(2)},${base.col.toFixed(2)}`;
      const group = cellGroups.get(key);
      if (group) {
        group.push(token);
      } else {
        cellGroups.set(key, [token]);
      }
    }

    const stackOffsets = [
      { dx: -6, dy: -6 },
      { dx: 6, dy: -6 },
      { dx: -6, dy: 6 },
      { dx: 6, dy: 6 },
    ];

    for (const token of tokens) {
      const base = getTokenBoardCoord(token.color, token.tokenIdx, token.step);
      const key = `${base.row.toFixed(2)},${base.col.toFixed(2)}`;
      const occupants = cellGroups.get(key) ?? [token];
      const idxInStack = occupants.indexOf(token);
      const isStacked = occupants.length > 1 && token.step >= 0 && token.step < 56;
      const offset = isStacked ? stackOffsets[idxInStack % 4] : { dx: 0, dy: 0 };

      const listIdx = this.tokenIndexMap.get(token.id);
      if (listIdx !== undefined) {
        this.tokenPositions.transition(listIdx, {
          px: base.col * CELL_SIZE + offset.dx,
          py: base.row * CELL_SIZE + offset.dy,
          scale: isStacked ? 0.82 : 1,
          selectable: selectableIds.has(token.id),
        });
      }
    }
  }
}
