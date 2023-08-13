import {
  getTokenBoardCoord,
  HOME_STRETCH_COORDS,
  MAIN_TRACK_COORDS,
  SAFE_TRACK_INDICES,
  START_TRACK_INDEX,
  YARD_SLOT_COORDS,
} from './ludoBoardData';
import { COLOR_HEX, COLOR_SOFT_HEX, LUDO_COLORS, LudoColor, LudoPlayer } from './types';

const CELL_SIZE = 40;
const SVG_SIZE = CELL_SIZE * 15; // 600x600

export function renderLudoBoardSvg(): string {
  const trackMap = new Map<string, number>();
  MAIN_TRACK_COORDS.forEach((c, idx) => {
    trackMap.set(`${c.row},${c.col}`, idx);
  });

  const homeStretchMap = new Map<string, LudoColor>();
  for (const color of LUDO_COLORS) {
    HOME_STRETCH_COORDS[color].forEach((c) => {
      homeStretchMap.set(`${c.row},${c.col}`, color);
    });
  }

  const startColorByTrackIdx = new Map<number, LudoColor>();
  for (const color of LUDO_COLORS) {
    startColorByTrackIdx.set(START_TRACK_INDEX[color], color);
  }

  const cellsSvg: string[] = [];

  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      // Skip the 4 corner 6x6 yards and the center 3x3 home goal
      if ((r < 6 && c < 6) || (r < 6 && c >= 9) || (r >= 9 && c < 6) || (r >= 9 && c >= 9)) {
        continue;
      }
      if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
        continue;
      }

      const key = `${r},${c}`;
      const trackIdx = trackMap.get(key);
      const stretchColor = homeStretchMap.get(key);
      const startColor = trackIdx !== undefined ? startColorByTrackIdx.get(trackIdx) : undefined;
      const isSafe = trackIdx !== undefined && SAFE_TRACK_INDICES.has(trackIdx);

      let fill = '#fdfaf3';
      if (startColor) {
        fill = COLOR_HEX[startColor];
      } else if (stretchColor) {
        fill = COLOR_SOFT_HEX[stretchColor];
      }

      const x = c * CELL_SIZE;
      const y = r * CELL_SIZE;

      cellsSvg.push(`
        <g id="cell-${r}-${c}" class="board-cell" data-row="${r}" data-col="${c}">
          <rect
            x="${x}"
            y="${y}"
            width="${CELL_SIZE}"
            height="${CELL_SIZE}"
            fill="${fill}"
            stroke="#8c7358"
            stroke-width="1.2"
          />
          ${
            stretchColor
              ? `<rect x="${x + 4}" y="${y + 4}" width="${CELL_SIZE - 8}" height="${CELL_SIZE - 8}" rx="4" fill="${COLOR_HEX[stretchColor]}" opacity="0.72" />`
              : ''
          }
          ${
            isSafe
              ? `<text x="${x + CELL_SIZE / 2}" y="${y + CELL_SIZE / 2 + 6}" text-anchor="middle" font-size="18" fill="${startColor ? '#fffdf9' : '#b8862d'}">★</text>`
              : ''
          }
        </g>
      `);
    }
  }

  const renderYard = (color: LudoColor, startRow: number, startCol: number) => {
    const x = startCol * CELL_SIZE;
    const y = startRow * CELL_SIZE;
    const size = 6 * CELL_SIZE;
    const hex = COLOR_HEX[color];
    const slots = YARD_SLOT_COORDS[color]
      .map(
        (slot, idx) => `
        <circle
          id="yard-slot-${color}-${idx}"
          cx="${slot.col * CELL_SIZE}"
          cy="${slot.row * CELL_SIZE}"
          r="18"
          fill="#fdfaf3"
          stroke="${hex}"
          stroke-width="3"
        />
      `
      )
      .join('');

    return `
      <g class="yard-group" data-color="${color}">
        <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${hex}" stroke="#5c4328" stroke-width="2" />
        <rect x="${x + 26}" y="${y + 26}" width="${size - 52}" height="${size - 52}" rx="18" fill="#fdfaf3" stroke="#d4b483" stroke-width="2.5" />
        ${slots}
      </g>
    `;
  };

  const cx = 7.5 * CELL_SIZE;
  const cy = 7.5 * CELL_SIZE;
  const tlX = 6 * CELL_SIZE;
  const tlY = 6 * CELL_SIZE;
  const brX = 9 * CELL_SIZE;
  const brY = 9 * CELL_SIZE;

  const centerGoalSvg = `
    <g class="center-home-goal">
      <polygon points="${tlX},${tlY} ${brX},${tlY} ${cx},${cy}" fill="${COLOR_HEX.red}" stroke="#5c4328" stroke-width="1.5" />
      <polygon points="${brX},${tlY} ${brX},${brY} ${cx},${cy}" fill="${COLOR_HEX.green}" stroke="#5c4328" stroke-width="1.5" />
      <polygon points="${tlX},${brY} ${brX},${brY} ${cx},${cy}" fill="${COLOR_HEX.yellow}" stroke="#5c4328" stroke-width="1.5" />
      <polygon points="${tlX},${tlY} ${tlX},${brY} ${cx},${cy}" fill="${COLOR_HEX.blue}" stroke="#5c4328" stroke-width="1.5" />
      <circle cx="${cx}" cy="${cy}" r="18" fill="#fdfaf3" stroke="#b8862d" stroke-width="2.5" />
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#5c4328">HOME</text>
    </g>
  `;

  const tokensSvg: string[] = [];
  for (const color of LUDO_COLORS) {
    const hex = COLOR_HEX[color];
    for (let idx = 0; idx < 4; idx++) {
      const tIdx = idx as 0 | 1 | 2 | 3;
      const coord = getTokenBoardCoord(color, tIdx, -1);
      const px = coord.col * CELL_SIZE;
      const py = coord.row * CELL_SIZE;
      tokensSvg.push(`
        <g
          id="token-${color}-${idx}"
          class="ludo-token"
          data-color="${color}"
          data-idx="${idx}"
          transform="translate(${px.toFixed(1)}, ${py.toFixed(1)})"
        >
          <circle class="token-pulse-ring" r="16" fill="none" stroke="#facc15" stroke-width="3" opacity="0" />
          <circle class="token-shadow" cy="2" r="13" fill="rgba(0,0,0,0.35)" />
          <circle class="token-body" r="12.5" fill="${hex}" stroke="#fffdf9" stroke-width="2.5" />
          <circle class="token-inner" r="6" fill="rgba(255,255,255,0.28)" />
          <text y="3.5" text-anchor="middle" fill="#fffdf9" font-size="9" font-weight="800">${idx + 1}</text>
        </g>
      `);
    }
  }

  return `
    <svg id="ludo-board-svg" viewBox="0 0 ${SVG_SIZE} ${SVG_SIZE}" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="${SVG_SIZE}" height="${SVG_SIZE}" rx="14" fill="#fdfaf3" stroke="#7a5c3c" stroke-width="4" />
      ${renderYard('blue', 0, 0)}
      ${renderYard('red', 0, 9)}
      ${renderYard('yellow', 9, 0)}
      ${renderYard('green', 9, 9)}
      ${cellsSvg.join('')}
      ${centerGoalSvg}
      <g id="dest-preview-layer"></g>
      <g id="tokens-layer">${tokensSvg.join('')}</g>
    </svg>
  `;
}

export function renderLudoWorkspaceMarkup(players: LudoPlayer[]): string {
  const playerCardsHtml = players
    .map(
      (p, idx) => `
      <div class="player-house-card${idx === 0 ? ' active-turn' : ''}" data-color="${p.color}">
        <div class="house-card-header">
          <span class="house-swatch" style="background:${COLOR_HEX[p.color]}"></span>
          <strong class="house-player-name">${p.name}</strong>
          <span class="house-role-badge">${p.control === 'human' ? 'You' : p.control.replace('bot-', 'AI ')}</span>
        </div>
        <div class="house-card-stats">
          <span id="player-home-count-${p.color}" class="house-stat-pill">${p.finishedCount} / 4 Home</span>
          <span id="player-capture-count-${p.color}" class="house-capture-pill">⚔️ ${p.captures}</span>
        </div>
      </div>
    `
    )
    .join('');

  const diceDotsHtml = Array.from(
    { length: 9 },
    (_, idx) => `<div id="dot-${idx}" class="dot ${idx === 4 ? 'visible' : 'invisible'}"></div>`
  ).join('');

  return `
    <div class="ludo-shell">
      <header class="ludo-topbar">
        <div class="ludo-brand">
          <h1 id="ludo-header">Ludo Royal</h1>
          <span class="ludo-subtitle-pill">4-House Pachisi Strategy Edition</span>
        </div>
        <div class="ludo-turn-banner">
          <span id="turn-color-badge" class="turn-color-badge">Crimson House</span>
          <span id="turn-status-prompt" class="turn-status-prompt">Roll the dice to begin!</span>
        </div>
        <div class="ludo-top-actions">
          <button type="button" id="btn-rules" class="ludo-btn">Rules</button>
          <button type="button" id="btn-new-match" class="ludo-btn primary">New Match</button>
        </div>
      </header>

      <div class="ludo-workspace">
        <aside class="ludo-sidebar">
          <section class="ludo-panel">
            <h2 class="panel-heading">Houses &amp; Standings</h2>
            <div id="players-roster-panel" class="players-roster-list">
              ${playerCardsHtml}
            </div>
          </section>

          <section class="ludo-panel dice-panel">
            <h2 class="panel-heading">Royal Dice Roller</h2>
            <div class="dice-stage-row">
              <div id="dice-box" class="dice dice-ready" title="Click or press Space to roll">
                ${diceDotsHtml}
              </div>
              <div class="dice-meta">
                <button type="button" id="btn-roll-dice" class="ludo-btn primary">Roll Dice</button>
                <span id="dice-roll-readout" class="dice-roll-readout">Ready to roll</span>
              </div>
            </div>
          </section>

          <section class="ludo-panel log-panel">
            <h2 class="panel-heading">Chronicle Log</h2>
            <div id="ludo-log-list" class="ludo-log-list">
              <div class="log-entry">Welcome to Ludo Royal! Roll a 6 to deploy a token from your yard.</div>
            </div>
          </section>
        </aside>

        <main class="ludo-board-stage">
          <div class="board-frame">
            ${renderLudoBoardSvg()}
          </div>
        </main>
      </div>

      <div id="ludo-modal-overlay" class="ludo-modal-overlay hidden"></div>
    </div>
  `;
}

export function showDestinationPreview(
  color: LudoColor,
  tokenIdx: 0 | 1 | 2 | 3,
  targetStep: number
): void {
  const layer = document.getElementById('dest-preview-layer');
  if (!layer) return;
  const coord = getTokenBoardCoord(color, tokenIdx, targetStep);
  const cx = coord.col * CELL_SIZE;
  const cy = coord.row * CELL_SIZE;
  const hex = COLOR_HEX[color];

  layer.innerHTML = `
    <g class="dest-preview-marker" transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)})">
      <circle r="15" fill="${hex}" opacity="0.28" />
      <circle r="15" fill="none" stroke="${hex}" stroke-width="2.5" stroke-dasharray="4,3" />
    </g>
  `;
}

export function clearDestinationPreview(): void {
  const layer = document.getElementById('dest-preview-layer');
  if (layer) {
    layer.innerHTML = '';
  }
}

export function openLudoRulesModal(): void {
  const modal = document.getElementById('ludo-modal-overlay');
  if (!modal) return;

  modal.innerHTML = `
    <div class="ludo-modal-card">
      <h3>🎲 Ludo Royal — Pachisi Rules</h3>
      <div class="mp-section">
        <ul>
          <li><strong>Deploying from Yard:</strong> Roll a <strong>6</strong> to move a token from your corner yard onto your colored starting star.</li>
          <li><strong>Bonus Rolls:</strong> Rolling a <strong>6</strong>, capturing an opponent's token, or reaching the center Home Goal awards an immediate bonus roll!</li>
          <li><strong>Three 6s Limit:</strong> Rolling three consecutive 6s forfeits your turn.</li>
          <li><strong>Safe Stars (★):</strong> The 4 colored starting squares and 4 mid-arm star squares protect all tokens on them from capture.</li>
          <li><strong>Exact Home Entry:</strong> Tokens must roll the exact remaining steps to enter the center Home triangle.</li>
        </ul>
      </div>
      <div class="ludo-modal-actions">
        <button type="button" id="btn-close-rules" class="ludo-btn primary">Got It</button>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  document.getElementById('btn-close-rules')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}
