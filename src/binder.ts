import { StateVarList, StyleVar } from 'statebinderk';
import { COLOR_HEX, LudoColor } from './types';

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
}
