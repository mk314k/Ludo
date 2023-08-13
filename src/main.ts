import './index.css';
import './App.css';
import {
  clearDestinationPreview,
  openLudoRulesModal,
  renderLudoWorkspaceMarkup,
  showDestinationPreview,
} from './boardView';
import { LudoBinder } from './binder';
import { LudoGameEngine } from './ludoEngine';
import { LudoPlayer } from './types';

function createDefaultRoster(): LudoPlayer[] {
  return [
    { color: 'red', name: 'Crimson (You)', control: 'human', finishedCount: 0, captures: 0 },
    { color: 'green', name: 'Emerald Bot', control: 'bot-aggressive', finishedCount: 0, captures: 0 },
    { color: 'yellow', name: 'Amber Bot', control: 'bot-safe', finishedCount: 0, captures: 0 },
    { color: 'blue', name: 'Sapphire Bot', control: 'bot-balanced', finishedCount: 0, captures: 0 },
  ];
}

function mountLudoApp(fresh = false): void {
  const root = document.getElementById('root');
  if (!root) return;

  if (fresh) {
    LudoGameEngine.clearSavedMatch();
  }

  const players = createDefaultRoster();
  root.innerHTML = renderLudoWorkspaceMarkup(players);

  const binder = new LudoBinder();
  const engine = new LudoGameEngine(players, binder);
  if (!fresh) {
    engine.restoreFromStorage();
  }

  const handleRollAction = () => {
    if (engine.activePlayer.control !== 'human') return;
    engine.rollDice();
  };

  document.getElementById('dice-box')?.addEventListener('click', handleRollAction);
  document.getElementById('btn-roll-dice')?.addEventListener('click', handleRollAction);

  document.querySelectorAll('.ludo-token').forEach((tokenEl) => {
    tokenEl.addEventListener('mouseenter', () => {
      const id = tokenEl.id;
      const opt = engine.availableMoves.find((m) => m.tokenId === id);
      const tok = engine.tokens.find((t) => t.id === id);
      if (opt && tok) {
        showDestinationPreview(tok.color, tok.tokenIdx, opt.toStep);
      }
    });
    tokenEl.addEventListener('mouseleave', () => {
      clearDestinationPreview();
    });
    tokenEl.addEventListener('click', () => {
      if (engine.activePlayer.control !== 'human') return;
      const id = tokenEl.id;
      clearDestinationPreview();
      engine.executeMove(id);
    });
  });

  document.getElementById('btn-rules')?.addEventListener('click', () => {
    openLudoRulesModal();
  });

  document.getElementById('btn-new-match')?.addEventListener('click', () => {
    mountLudoApp(true);
  });
}

mountLudoApp(false);
