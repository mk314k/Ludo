import { LudoBinder } from './binder';
import { SAFE_TRACK_INDICES, stepToGlobalTrackIndex } from './ludoBoardData';
import {
  COLOR_HEX,
  LUDO_COLORS,
  LudoColor,
  LudoMoveOption,
  LudoPlayer,
  LudoToken,
  TurnStage,
} from './types';

const STORAGE_KEY = 'ludo_royal.save.v1';

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
        const nextStep = token.step + diceValue;
        const globalIdx = stepToGlobalTrackIndex(color, nextStep);
        const landsOnStar = globalIdx !== null && SAFE_TRACK_INDICES.has(globalIdx);
        const captured = this.getCapturableOpponentsAt(color, nextStep);
        options.push({
          tokenId: token.id,
          tokenIdx: token.tokenIdx,
          fromStep: token.step,
          toStep: nextStep,
          willCapture: captured.length > 0,
          willFinish: nextStep === 56,
          landsOnStar,
        });
      }
    }
    return options;
  }

  public getCapturableOpponentsAt(moverColor: LudoColor, targetStep: number): LudoToken[] {
    const globalIdx = stepToGlobalTrackIndex(moverColor, targetStep);
    if (globalIdx === null || SAFE_TRACK_INDICES.has(globalIdx)) {
      return [];
    }
    return this.tokens.filter((other) => {
      if (other.color === moverColor) return false;
      const otherGlobal = stepToGlobalTrackIndex(other.color, other.step);
      return otherGlobal === globalIdx;
    });
  }

  public executeMove(tokenId: string): boolean {
    if (this.stage !== 'waiting-for-move') return false;
    const option = this.availableMoves.find((m) => m.tokenId === tokenId);
    if (!option) return false;

    const token = this.tokens.find((t) => t.id === tokenId);
    if (!token) return false;

    const player = this.activePlayer;
    const victims = this.getCapturableOpponentsAt(player.color, option.toStep);
    token.step = option.toStep;
    this.availableMoves = [];

    let earnedBonusTurn = this.currentDice === 6;

    if (option.willFinish) {
      player.finishedCount = this.tokens.filter((t) => t.color === player.color && t.step >= 56).length;
      earnedBonusTurn = true;
      this.appendLog(
        `🏠 ${player.name}'s Token #${token.tokenIdx + 1} reached the center Home Goal (${player.finishedCount}/4)!`
      );
      if (player.finishedCount >= 4 && !player.rank) {
        const assignedRanks = this.players.filter((p) => p.rank !== undefined).length;
        player.rank = assignedRanks + 1;
        this.appendLog(`🏆 ${player.name} finished all 4 tokens in #${player.rank} place!`);
      }
    } else if (victims.length > 0) {
      for (const victim of victims) {
        victim.step = -1;
      }
      player.captures += victims.length;
      earnedBonusTurn = true;
      const capEl = document.getElementById(`player-capture-count-${player.color}`);
      if (capEl) {
        capEl.textContent = `⚔️ ${player.captures}`;
      }
      this.appendLog(
        `⚔️ ${player.name} captured ${victims[0].color.toUpperCase()} Token #${victims[0].tokenIdx + 1} and earned a Bonus Roll!`
      );
    } else if (option.fromStep === -1) {
      this.appendLog(`${player.name} deployed Token #${token.tokenIdx + 1} onto the starting star!`);
    } else {
      this.appendLog(`${player.name} advanced Token #${token.tokenIdx + 1} by ${this.currentDice} steps.`);
    }

    if (earnedBonusTurn && (player.finishedCount < 4)) {
      this.stage = 'waiting-for-roll';
      this.syncUI(`${player.name} earned a Bonus Roll — Roll again!`);
      this.scheduleBotTurnIfNeeded();
      return true;
    }

    this.advanceToNextPlayer();
    return true;
  }

  public advanceToNextPlayer(): void {
    this.consecutiveSixes = 0;
    this.availableMoves = [];

    const unfinished = this.players.filter((p) => p.finishedCount < 4);
    if (unfinished.length <= 1) {
      if (unfinished.length === 1 && !unfinished[0].rank) {
        unfinished[0].rank = this.players.length;
      }
      this.stage = 'game-over';
      this.syncUI('🏆 Match Complete! View final standings.');
      this.showWinCelebrationModal();
      return;
    }

    let tries = 0;
    do {
      this.activePlayerIdx = (this.activePlayerIdx + 1) % this.players.length;
      tries += 1;
    } while (this.players[this.activePlayerIdx].finishedCount >= 4 && tries < this.players.length);

    this.stage = 'waiting-for-roll';
    const next = this.activePlayer;
    this.syncUI(`${next.name}'s turn — Roll the dice!`);
    this.scheduleBotTurnIfNeeded();
  }

  public scheduleBotTurnIfNeeded(): void {
    if (this.stage === 'game-over') return;
    const player = this.activePlayer;
    if (!player.control.startsWith('bot-')) return;

    window.setTimeout(() => {
      if (this.stage === 'waiting-for-roll' && this.activePlayer.color === player.color) {
        this.rollDice();
        window.setTimeout(() => {
          if (this.stage === 'waiting-for-move' && this.activePlayer.color === player.color) {
            const chosen = this.chooseBestBotMove(player, this.availableMoves);
            if (chosen) {
              this.executeMove(chosen.tokenId);
            }
          }
        }, 420);
      }
    }, 520);
  }

  public chooseBestBotMove(bot: LudoPlayer, moves: LudoMoveOption[]): LudoMoveOption | null {
    if (moves.length === 0) return null;

    const scored = moves.map((m) => {
      let score = m.toStep * 1.2;
      if (m.fromStep === -1) score += 45;
      if (m.willFinish) score += 80;

      if (bot.control === 'bot-aggressive') {
        if (m.willCapture) score += 95;
        if (m.landsOnStar) score += 20;
      } else if (bot.control === 'bot-safe') {
        if (m.landsOnStar) score += 75;
        if (m.toStep >= 51) score += 50;
        if (m.willCapture) score += 45;
      } else {
        if (m.willCapture) score += 70;
        if (m.landsOnStar) score += 45;
        if (m.toStep >= 51) score += 35;
      }
      return { move: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].move;
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
    this.saveToStorage();
  }

  public showWinCelebrationModal(): void {
    const modal = document.getElementById('ludo-modal-overlay');
    if (!modal) return;
    const sorted = [...this.players].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99) || b.finishedCount - a.finishedCount);
    const rowsHtml = sorted
      .map(
        (p, idx) => `
        <tr>
          <td>#${p.rank ?? idx + 1}</td>
          <td><span class="house-swatch" style="display:inline-block;background:${COLOR_HEX[p.color]};margin-right:6px"></span><strong>${p.name}</strong></td>
          <td>${p.finishedCount} / 4</td>
          <td>⚔️ ${p.captures}</td>
        </tr>
      `
      )
      .join('');

    modal.innerHTML = `
      <div class="ludo-modal-card">
        <h3>🏆 Royal Pachisi — Final Standings</h3>
        <p class="ludo-modal-sub">Champion: <strong>${sorted[0].name}</strong>!</p>
        <table class="ludo-table">
          <thead>
            <tr><th>Rank</th><th>House</th><th>Home</th><th>Captures</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="ludo-modal-actions">
          <button type="button" id="btn-close-win-modal" class="ludo-btn primary">Close</button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    document.getElementById('btn-close-win-modal')?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  public saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        players: this.players,
        tokens: this.tokens,
        activePlayerIdx: this.activePlayerIdx,
        stage: this.stage === 'waiting-for-move' ? 'waiting-for-roll' : this.stage,
        currentDice: this.currentDice,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }

  public restoreFromStorage(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.tokens) || parsed.tokens.length !== 16) return false;
      this.players = Array.isArray(parsed.players) ? parsed.players : this.players;
      this.tokens = parsed.tokens;
      this.activePlayerIdx = typeof parsed.activePlayerIdx === 'number' ? parsed.activePlayerIdx : 0;
      this.stage = parsed.stage ?? 'waiting-for-roll';
      this.currentDice = parsed.currentDice ?? 1;
      this.syncUI(`Resumed match — ${this.activePlayer.name}'s turn.`);
      return true;
    } catch {
      return false;
    }
  }

  public static clearSavedMatch(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
