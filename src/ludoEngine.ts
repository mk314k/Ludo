import { LudoBinder } from './binder';
import {
  LUDO_COLORS,
  LudoColor,
  LudoMoveOption,
  LudoPlayer,
  LudoToken,
  TurnStage,
} from './types';

export class LudoGameEngine {
  public players: LudoPlayer[];
  public tokens: LudoToken[] = [];
  public activePlayerIdx = 0;
  public stage: TurnStage = 'waiting-for-roll';
  public currentDice = 1;
  public consecutiveSixes = 0;
  public availableMoves: LudoMoveOption[] = [];
  public binder: LudoBinder;

  public constructor(players: LudoPlayer[], binder: LudoBinder) {
    this.players = players;
    this.binder = binder;
    this.initTokens();
  }

  public initTokens(): void {
    this.tokens = [];
    for (const color of LUDO_COLORS) {
      for (let i = 0; i < 4; i++) {
        this.tokens.push({
          id: `token-${color}-${i}`,
          color,
          tokenIdx: i as 0 | 1 | 2 | 3,
          step: -1,
        });
      }
    }
    this.syncUI('Roll the dice to begin!');
  }

  public get activePlayer(): LudoPlayer {
    return this.players[this.activePlayerIdx];
  }

  public appendLog(message: string): void {
    const listEl = document.getElementById('ludo-log-list');
    if (!listEl) return;
    const item = document.createElement('div');
    item.className = 'log-entry';
    item.textContent = message;
    listEl.prepend(item);
    while (listEl.children.length > 24) {
      listEl.lastElementChild?.remove();
    }
  }

  public rollDice(forcedValue?: number): number {
    if (this.stage !== 'waiting-for-roll') {
      return this.currentDice;
    }

    const roll = forcedValue ?? Math.floor(Math.random() * 6) + 1;
    this.currentDice = roll;
    const player = this.activePlayer;
    this.binder.syncDice(roll, player.color);

    const readout = document.getElementById('dice-roll-readout');
    if (readout) {
      readout.textContent = `${player.name} rolled ${roll}`;
    }

    if (roll === 6) {
      this.consecutiveSixes += 1;
      if (this.consecutiveSixes >= 3) {
        this.appendLog(`⚠️ ${player.name} rolled three 6s in a row — turn forfeited!`);
        this.consecutiveSixes = 0;
        this.advanceToNextPlayer();
        return roll;
      }
    } else {
      this.consecutiveSixes = 0;
    }

    this.availableMoves = this.computeValidMoves(player.color, roll);

    if (this.availableMoves.length === 0) {
      this.appendLog(`${player.name} rolled ${roll} — no legal moves available.`);
      window.setTimeout(() => {
        this.advanceToNextPlayer();
      }, 480);
      return roll;
    }

    this.stage = 'waiting-for-move';
    this.syncUI(`${player.name} rolled ${roll} — select a highlighted token to move.`);
    return roll;
  }

  public computeValidMoves(color: LudoColor, diceValue: number): LudoMoveOption[] {
    const myTokens = this.tokens.filter((t) => t.color === color);
    const options: LudoMoveOption[] = [];

    for (const token of myTokens) {
      if (token.step >= 56) continue;
      if (token.step === -1) {
        if (diceValue === 6) {
          options.push({
            tokenId: token.id,
            tokenIdx: token.tokenIdx,
            fromStep: -1,
            toStep: 0,
            landsOnStar: true,
          });
        }
      } else if (token.step + diceValue <= 56) {
        options.push({
          tokenId: token.id,
          tokenIdx: token.tokenIdx,
          fromStep: token.step,
          toStep: token.step + diceValue,
        });
      }
    }
    return options;
  }

  public advanceToNextPlayer(): void {
    this.consecutiveSixes = 0;
    this.availableMoves = [];
    this.stage = 'waiting-for-roll';
    this.activePlayerIdx = (this.activePlayerIdx + 1) % this.players.length;
    const next = this.activePlayer;
    this.syncUI(`${next.name}'s turn — Roll the dice!`);
  }

  public syncUI(statusText: string): void {
    const selectableIds = new Set(this.availableMoves.map((m) => m.tokenId));
    this.binder.syncTokens(this.tokens, selectableIds);
    this.binder.playerFinishedCounts.listTransition(
      LUDO_COLORS.map((col) => this.tokens.filter((t) => t.color === col && t.step >= 56).length)
    );
    const active = this.activePlayer;
    this.binder.turnBanner.transition({
      activeColor: active.color,
      playerName: active.name,
      stage: this.stage,
      statusText,
    });
  }
}
