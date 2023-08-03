import './index.css';
import './App.css';
import { StateVar } from 'statebinderk';

const root = document.getElementById('root');
if (root) {
  root.innerHTML = `<div id="ludo-header">Ludo — Royal Pachisi Edition</div>`;
  const titleVar = new StateVar<string>(
    'Ludo — Royal Pachisi Edition',
    'ludo-header',
    (el, val) => {
      el.textContent = val;
    }
  );
  titleVar.transition('Ludo — Royal Pachisi Edition');
}
