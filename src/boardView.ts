import {
  HOME_STRETCH_COORDS,
  MAIN_TRACK_COORDS,
  SAFE_TRACK_INDICES,
  START_TRACK_INDEX,
  YARD_SLOT_COORDS,
} from './ludoBoardData';
import { COLOR_HEX, COLOR_SOFT_HEX, LUDO_COLORS, LudoColor } from './types';

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
      <g id="tokens-layer"></g>
    </svg>
  `;
}
