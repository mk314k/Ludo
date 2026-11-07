var Y=Object.defineProperty;var j=(i,s,o)=>s in i?Y(i,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):i[s]=o;var h=(i,s,o)=>(j(i,typeof s!="symbol"?s+"":s,o),o);(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const _=[{row:1,col:8},{row:2,col:8},{row:3,col:8},{row:4,col:8},{row:5,col:8},{row:6,col:9},{row:6,col:10},{row:6,col:11},{row:6,col:12},{row:6,col:13},{row:6,col:14},{row:7,col:14},{row:8,col:14},{row:8,col:13},{row:8,col:12},{row:8,col:11},{row:8,col:10},{row:8,col:9},{row:9,col:8},{row:10,col:8},{row:11,col:8},{row:12,col:8},{row:13,col:8},{row:14,col:8},{row:14,col:7},{row:14,col:6},{row:13,col:6},{row:12,col:6},{row:11,col:6},{row:10,col:6},{row:9,col:6},{row:8,col:5},{row:8,col:4},{row:8,col:3},{row:8,col:2},{row:8,col:1},{row:8,col:0},{row:7,col:0},{row:6,col:0},{row:6,col:1},{row:6,col:2},{row:6,col:3},{row:6,col:4},{row:6,col:5},{row:5,col:6},{row:4,col:6},{row:3,col:6},{row:2,col:6},{row:1,col:6},{row:0,col:6},{row:0,col:7},{row:0,col:8}],O={red:0,green:13,yellow:26,blue:39},P=new Set([0,8,13,21,26,34,39,47]),F={red:[{row:1,col:7},{row:2,col:7},{row:3,col:7},{row:4,col:7},{row:5,col:7}],green:[{row:7,col:13},{row:7,col:12},{row:7,col:11},{row:7,col:10},{row:7,col:9}],yellow:[{row:13,col:7},{row:12,col:7},{row:11,col:7},{row:10,col:7},{row:9,col:7}],blue:[{row:7,col:1},{row:7,col:2},{row:7,col:3},{row:7,col:4},{row:7,col:5}]},N={blue:[{row:1.8,col:1.8},{row:1.8,col:4.2},{row:4.2,col:1.8},{row:4.2,col:4.2}],red:[{row:1.8,col:10.8},{row:1.8,col:13.2},{row:4.2,col:10.8},{row:4.2,col:13.2}],yellow:[{row:10.8,col:1.8},{row:10.8,col:4.2},{row:13.2,col:1.8},{row:13.2,col:4.2}],green:[{row:10.8,col:10.8},{row:10.8,col:13.2},{row:13.2,col:10.8},{row:13.2,col:13.2}]},q={red:[{row:6.35,col:7.1},{row:6.35,col:7.5},{row:6.35,col:7.9},{row:6.65,col:7.5}],green:[{row:7.1,col:8.65},{row:7.5,col:8.65},{row:7.9,col:8.65},{row:7.5,col:8.35}],yellow:[{row:8.65,col:7.1},{row:8.65,col:7.5},{row:8.65,col:7.9},{row:8.35,col:7.5}],blue:[{row:7.1,col:6.35},{row:7.5,col:6.35},{row:7.9,col:6.35},{row:7.5,col:6.65}]};function T(i,s){return s<0||s>50?null:(O[i]+s)%52}function L(i,s,o){if(o<0)return N[i][s];if(o<=50){const r=(O[i]+o)%52,e=_[r];return{row:e.row+.5,col:e.col+.5}}if(o<=55){const r=o-51,e=F[i][r];return{row:e.row+.5,col:e.col+.5}}return q[i][s]}const k=["red","green","yellow","blue"],f={red:"#d6392e",green:"#2a8540",yellow:"#dca024",blue:"#26689c"},V={red:"#f9dcd9",green:"#d8f0de",yellow:"#fbf0cf",blue:"#d6e8f7"},d=40,E=d*15;function W(){const i=new Map;_.forEach((a,c)=>{i.set(`${a.row},${a.col}`,c)});const s=new Map;for(const a of k)F[a].forEach(c=>{s.set(`${c.row},${c.col}`,a)});const o=new Map;for(const a of k)o.set(O[a],a);const r=[];for(let a=0;a<15;a++)for(let c=0;c<15;c++){if(a<6&&c<6||a<6&&c>=9||a>=9&&c<6||a>=9&&c>=9||a>=6&&a<=8&&c>=6&&c<=8)continue;const w=`${a},${c}`,b=i.get(w),y=s.get(w),m=b!==void 0?o.get(b):void 0,x=b!==void 0&&P.has(b);let S="#fdfaf3";m?S=f[m]:y&&(S=V[y]);const I=c*d,C=a*d;r.push(`
        <g id="cell-${a}-${c}" class="board-cell" data-row="${a}" data-col="${c}">
          <rect
            x="${I}"
            y="${C}"
            width="${d}"
            height="${d}"
            fill="${S}"
            stroke="#8c7358"
            stroke-width="1.2"
          />
          ${y?`<rect x="${I+4}" y="${C+4}" width="${d-8}" height="${d-8}" rx="4" fill="${f[y]}" opacity="0.72" />`:""}
          ${x?`<text x="${I+d/2}" y="${C+d/2+6}" text-anchor="middle" font-size="18" fill="${m?"#fffdf9":"#b8862d"}">★</text>`:""}
        </g>
      `)}const e=(a,c,w)=>{const b=w*d,y=c*d,m=6*d,x=f[a],S=N[a].map((I,C)=>`
        <circle
          id="yard-slot-${a}-${C}"
          cx="${I.col*d}"
          cy="${I.row*d}"
          r="18"
          fill="#fdfaf3"
          stroke="${x}"
          stroke-width="3"
        />
      `).join("");return`
      <g class="yard-group" data-color="${a}">
        <rect x="${b}" y="${y}" width="${m}" height="${m}" fill="${x}" stroke="#5c4328" stroke-width="2" />
        <rect x="${b+26}" y="${y+26}" width="${m-52}" height="${m-52}" rx="18" fill="#fdfaf3" stroke="#d4b483" stroke-width="2.5" />
        ${S}
      </g>
    `},t=7.5*d,n=7.5*d,l=6*d,u=6*d,g=9*d,p=9*d,v=`
    <g class="center-home-goal">
      <polygon points="${l},${u} ${g},${u} ${t},${n}" fill="${f.red}" stroke="#5c4328" stroke-width="1.5" />
      <polygon points="${g},${u} ${g},${p} ${t},${n}" fill="${f.green}" stroke="#5c4328" stroke-width="1.5" />
      <polygon points="${l},${p} ${g},${p} ${t},${n}" fill="${f.yellow}" stroke="#5c4328" stroke-width="1.5" />
      <polygon points="${l},${u} ${l},${p} ${t},${n}" fill="${f.blue}" stroke="#5c4328" stroke-width="1.5" />
      <circle cx="${t}" cy="${n}" r="18" fill="#fdfaf3" stroke="#b8862d" stroke-width="2.5" />
      <text x="${t}" y="${n+4}" text-anchor="middle" font-size="11" font-weight="800" fill="#5c4328">HOME</text>
    </g>
  `,$=[];for(const a of k){const c=f[a];for(let w=0;w<4;w++){const y=L(a,w,-1),m=y.col*d,x=y.row*d;$.push(`
        <g
          id="token-${a}-${w}"
          class="ludo-token"
          data-color="${a}"
          data-idx="${w}"
          transform="translate(${m.toFixed(1)}, ${x.toFixed(1)})"
        >
          <circle class="token-pulse-ring" r="16" fill="none" stroke="#facc15" stroke-width="3" opacity="0" />
          <circle class="token-shadow" cy="2" r="13" fill="rgba(0,0,0,0.35)" />
          <circle class="token-body" r="12.5" fill="${c}" stroke="#fffdf9" stroke-width="2.5" />
          <circle class="token-inner" r="6" fill="rgba(255,255,255,0.28)" />
          <text y="3.5" text-anchor="middle" fill="#fffdf9" font-size="9" font-weight="800">${w+1}</text>
        </g>
      `)}}return`
    <svg id="ludo-board-svg" viewBox="0 0 ${E} ${E}" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="${E}" height="${E}" rx="14" fill="#fdfaf3" stroke="#7a5c3c" stroke-width="4" />
      ${e("blue",0,0)}
      ${e("red",0,9)}
      ${e("yellow",9,0)}
      ${e("green",9,9)}
      ${r.join("")}
      ${v}
      <g id="dest-preview-layer"></g>
      <g id="tokens-layer">${$.join("")}</g>
    </svg>
  `}function K(i){const s=i.map((r,e)=>`
      <div class="player-house-card${e===0?" active-turn":""}" data-color="${r.color}">
        <div class="house-card-header">
          <span class="house-swatch" style="background:${f[r.color]}"></span>
          <strong class="house-player-name">${r.name}</strong>
          <span class="house-role-badge">${r.control==="human"?"You":r.control.replace("bot-","AI ")}</span>
        </div>
        <div class="house-card-stats">
          <span id="player-home-count-${r.color}" class="house-stat-pill">${r.finishedCount} / 4 Home</span>
          <span id="player-capture-count-${r.color}" class="house-capture-pill">⚔️ ${r.captures}</span>
        </div>
      </div>
    `).join(""),o=Array.from({length:9},(r,e)=>`<div id="dot-${e}" class="dot ${e===4?"visible":"invisible"}"></div>`).join("");return`
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
              ${s}
            </div>
          </section>

          <section class="ludo-panel dice-panel">
            <h2 class="panel-heading">Royal Dice Roller</h2>
            <div class="dice-stage-row">
              <div id="dice-box" class="dice dice-ready" title="Click or press Space to roll">
                ${o}
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
            ${W()}
          </div>
        </main>
      </div>

      <div id="ludo-modal-overlay" class="ludo-modal-overlay hidden"></div>
    </div>
  `}function X(i,s,o){const r=document.getElementById("dest-preview-layer");if(!r)return;const e=L(i,s,o),t=e.col*d,n=e.row*d,l=f[i];r.innerHTML=`
    <g class="dest-preview-marker" transform="translate(${t.toFixed(1)}, ${n.toFixed(1)})">
      <circle r="15" fill="${l}" opacity="0.28" />
      <circle r="15" fill="none" stroke="${l}" stroke-width="2.5" stroke-dasharray="4,3" />
    </g>
  `}function A(){const i=document.getElementById("dest-preview-layer");i&&(i.innerHTML="")}function z(){var s;const i=document.getElementById("ludo-modal-overlay");i&&(i.innerHTML=`
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
  `,i.classList.remove("hidden"),(s=document.getElementById("btn-close-rules"))==null||s.addEventListener("click",()=>{i.classList.add("hidden")}))}class G{constructor(s){h(this,"state");this.state=s}transition(s){this.state=s}current(){return this.state}}class Z extends G{constructor(o,r,e,t){super(o);h(this,"stateToStyle",o=>`${o}`);this.id=r,this.prop=e,t&&(this.stateToStyle=t)}transition(o){super.transition(o);const r=document.getElementById(this.id);r&&(r.style[this.prop]=this.stateToStyle(this.current()))}}class J extends G{constructor(){super(...arguments);h(this,"bindings",new Map)}transition(o){super.transition(o),this.bindings.forEach((r,e)=>{const t=document.getElementById(e);t&&r(t,o)})}addBinding(o,r){this.bindings.set(o,r)}}class M{constructor(s,o){h(this,"ids",[]);h(this,"states",[]);this.funct=o,s.map(r=>{this.addBinding(r.id,r.state)})}transition(s,o){if(s>=0&&s<this.ids.length){this.states[s]=o;const r=document.getElementById(this.ids[s]??"");r&&this.funct(r,o)}else throw Error("index out of bounds")}current(s){if(s>=0&&s<this.ids.length)return this.states[s];throw Error("index out of bounds")}listTransition(s){if(s.length===this.states.length)s.map((o,r)=>{this.transition(r,o)});else throw Error("states does not match the length, use transition method instead")}addBinding(s,o){this.ids.push(s),this.states.push(o)}}const B=40,D=[[0,0,0,0,1,0,0,0,0],[0,0,1,0,0,0,1,0,0],[0,0,1,0,1,0,1,0,0],[1,0,1,0,0,0,1,0,1],[1,0,1,0,1,0,1,0,1],[1,0,1,1,0,1,1,0,1]];class Q{constructor(){h(this,"dicePips");h(this,"diceBorderColor");h(this,"tokenPositions");h(this,"playerFinishedCounts");h(this,"turnBanner");h(this,"tokenIndexMap",new Map);const s=Array.from({length:9},(e,t)=>({id:`dot-${t}`,state:D[0][t]}));this.dicePips=new M(s,(e,t)=>{t===1?(e.classList.add("visible"),e.classList.remove("invisible")):(e.classList.add("invisible"),e.classList.remove("visible"))}),this.diceBorderColor=new Z(f.red,"dice-box","borderColor");const o=[];for(const e of k)for(let t=0;t<4;t++){const l=L(e,t,-1),u=`token-${e}-${t}`;this.tokenIndexMap.set(u,o.length),o.push({id:u,state:{px:l.col*B,py:l.row*B,scale:1,selectable:!1}})}this.tokenPositions=new M(o,(e,t)=>{e.setAttribute("transform",`translate(${t.px.toFixed(1)}, ${t.py.toFixed(1)}) scale(${t.scale.toFixed(2)})`);const n=e.querySelector(".token-pulse-ring");t.selectable?(e.classList.add("token-selectable"),n==null||n.setAttribute("opacity","1")):(e.classList.remove("token-selectable"),n==null||n.setAttribute("opacity","0"))});const r=k.map(e=>({id:`player-home-count-${e}`,state:0}));this.playerFinishedCounts=new M(r,(e,t)=>{e.textContent=`${t} / 4 Home`}),this.turnBanner=new J({activeColor:"red",playerName:"Crimson House",stage:"waiting-for-roll",statusText:"Roll the dice to begin!"}),this.turnBanner.addBinding("turn-color-badge",(e,t)=>{e.textContent=t.playerName,e.style.backgroundColor=f[t.activeColor]}),this.turnBanner.addBinding("turn-status-prompt",(e,t)=>{e.textContent=t.statusText}),this.turnBanner.addBinding("players-roster-panel",(e,t)=>{e.querySelectorAll(".player-house-card").forEach(l=>{l.getAttribute("data-color")===t.activeColor?l.classList.add("active-turn"):l.classList.remove("active-turn")})}),this.turnBanner.addBinding("dice-box",(e,t)=>{t.stage==="waiting-for-roll"?e.classList.add("dice-ready"):e.classList.remove("dice-ready")})}syncDice(s,o){const r=Math.max(1,Math.min(6,s)),e=D[r-1];this.dicePips.listTransition(e),this.diceBorderColor.transition(f[o]);const t=document.getElementById("dice-box");t&&(t.classList.remove("dice-rolling"),t.offsetWidth,t.classList.add("dice-rolling"))}syncTokens(s,o=new Set){const r=new Map;for(const t of s){const n=L(t.color,t.tokenIdx,t.step),l=`${n.row.toFixed(2)},${n.col.toFixed(2)}`,u=r.get(l);u?u.push(t):r.set(l,[t])}const e=[{dx:-6,dy:-6},{dx:6,dy:-6},{dx:-6,dy:6},{dx:6,dy:6}];for(const t of s){const n=L(t.color,t.tokenIdx,t.step),l=`${n.row.toFixed(2)},${n.col.toFixed(2)}`,u=r.get(l)??[t],g=u.indexOf(t),p=u.length>1&&t.step>=0&&t.step<56,v=p?e[g%4]:{dx:0,dy:0},$=this.tokenIndexMap.get(t.id);$!==void 0&&this.tokenPositions.transition($,{px:n.col*B+v.dx,py:n.row*B+v.dy,scale:p?.82:1,selectable:o.has(t.id)})}}}const R="ludo_royal.save.v1";class H{constructor(s,o){h(this,"players");h(this,"tokens",[]);h(this,"activePlayerIdx",0);h(this,"stage","waiting-for-roll");h(this,"currentDice",1);h(this,"consecutiveSixes",0);h(this,"availableMoves",[]);h(this,"binder");this.players=s,this.binder=o,this.initTokens()}initTokens(){this.tokens=[];for(const s of k)for(let o=0;o<4;o++)this.tokens.push({id:`token-${s}-${o}`,color:s,tokenIdx:o,step:-1});this.syncUI("Roll the dice to begin!")}get activePlayer(){return this.players[this.activePlayerIdx]}appendLog(s){var e;const o=document.getElementById("ludo-log-list");if(!o)return;const r=document.createElement("div");for(r.className="log-entry",r.textContent=s,o.prepend(r);o.children.length>24;)(e=o.lastElementChild)==null||e.remove()}rollDice(s){if(this.stage!=="waiting-for-roll")return this.currentDice;const o=s??Math.floor(Math.random()*6)+1;this.currentDice=o;const r=this.activePlayer;this.binder.syncDice(o,r.color);const e=document.getElementById("dice-roll-readout");if(e&&(e.textContent=`${r.name} rolled ${o}`),o===6){if(this.consecutiveSixes+=1,this.consecutiveSixes>=3)return this.appendLog(`⚠️ ${r.name} rolled three 6s in a row — turn forfeited!`),this.consecutiveSixes=0,this.advanceToNextPlayer(),o}else this.consecutiveSixes=0;return this.availableMoves=this.computeValidMoves(r.color,o),this.availableMoves.length===0?(this.appendLog(`${r.name} rolled ${o} — no legal moves available.`),window.setTimeout(()=>{this.advanceToNextPlayer()},480),o):(this.stage="waiting-for-move",this.syncUI(`${r.name} rolled ${o} — select a highlighted token to move.`),o)}computeValidMoves(s,o){const r=this.tokens.filter(t=>t.color===s),e=[];for(const t of r)if(!(t.step>=56)){if(t.step===-1)o===6&&e.push({tokenId:t.id,tokenIdx:t.tokenIdx,fromStep:-1,toStep:0,landsOnStar:!0});else if(t.step+o<=56){const n=t.step+o,l=T(s,n),u=l!==null&&P.has(l),g=this.getCapturableOpponentsAt(s,n);e.push({tokenId:t.id,tokenIdx:t.tokenIdx,fromStep:t.step,toStep:n,willCapture:g.length>0,willFinish:n===56,landsOnStar:u})}}return e}getCapturableOpponentsAt(s,o){const r=T(s,o);return r===null||P.has(r)?[]:this.tokens.filter(e=>e.color===s?!1:T(e.color,e.step)===r)}executeMove(s){if(this.stage!=="waiting-for-move")return!1;const o=this.availableMoves.find(l=>l.tokenId===s);if(!o)return!1;const r=this.tokens.find(l=>l.id===s);if(!r)return!1;const e=this.activePlayer,t=this.getCapturableOpponentsAt(e.color,o.toStep);r.step=o.toStep,this.availableMoves=[];let n=this.currentDice===6;if(o.willFinish){if(e.finishedCount=this.tokens.filter(l=>l.color===e.color&&l.step>=56).length,n=!0,this.appendLog(`🏠 ${e.name}'s Token #${r.tokenIdx+1} reached the center Home Goal (${e.finishedCount}/4)!`),e.finishedCount>=4&&!e.rank){const l=this.players.filter(u=>u.rank!==void 0).length;e.rank=l+1,this.appendLog(`🏆 ${e.name} finished all 4 tokens in #${e.rank} place!`)}}else if(t.length>0){for(const u of t)u.step=-1;e.captures+=t.length,n=!0;const l=document.getElementById(`player-capture-count-${e.color}`);l&&(l.textContent=`⚔️ ${e.captures}`),this.appendLog(`⚔️ ${e.name} captured ${t[0].color.toUpperCase()} Token #${t[0].tokenIdx+1} and earned a Bonus Roll!`)}else o.fromStep===-1?this.appendLog(`${e.name} deployed Token #${r.tokenIdx+1} onto the starting star!`):this.appendLog(`${e.name} advanced Token #${r.tokenIdx+1} by ${this.currentDice} steps.`);return n&&e.finishedCount<4?(this.stage="waiting-for-roll",this.syncUI(`${e.name} earned a Bonus Roll — Roll again!`),this.scheduleBotTurnIfNeeded(),!0):(this.advanceToNextPlayer(),!0)}advanceToNextPlayer(){this.consecutiveSixes=0,this.availableMoves=[];const s=this.players.filter(e=>e.finishedCount<4);if(s.length<=1){s.length===1&&!s[0].rank&&(s[0].rank=this.players.length),this.stage="game-over",this.syncUI("🏆 Match Complete! View final standings."),this.showWinCelebrationModal();return}let o=0;do this.activePlayerIdx=(this.activePlayerIdx+1)%this.players.length,o+=1;while(this.players[this.activePlayerIdx].finishedCount>=4&&o<this.players.length);this.stage="waiting-for-roll";const r=this.activePlayer;this.syncUI(`${r.name}'s turn — Roll the dice!`),this.scheduleBotTurnIfNeeded()}scheduleBotTurnIfNeeded(){if(this.stage==="game-over")return;const s=this.activePlayer;s.control.startsWith("bot-")&&window.setTimeout(()=>{this.stage==="waiting-for-roll"&&this.activePlayer.color===s.color&&(this.rollDice(),window.setTimeout(()=>{if(this.stage==="waiting-for-move"&&this.activePlayer.color===s.color){const o=this.chooseBestBotMove(s,this.availableMoves);o&&this.executeMove(o.tokenId)}},420))},520)}chooseBestBotMove(s,o){if(o.length===0)return null;const r=o.map(e=>{let t=e.toStep*1.2;return e.fromStep===-1&&(t+=45),e.willFinish&&(t+=80),s.control==="bot-aggressive"?(e.willCapture&&(t+=95),e.landsOnStar&&(t+=20)):s.control==="bot-safe"?(e.landsOnStar&&(t+=75),e.toStep>=51&&(t+=50),e.willCapture&&(t+=45)):(e.willCapture&&(t+=70),e.landsOnStar&&(t+=45),e.toStep>=51&&(t+=35)),{move:e,score:t}});return r.sort((e,t)=>t.score-e.score),r[0].move}syncUI(s){const o=new Set(this.availableMoves.map(e=>e.tokenId));this.binder.syncTokens(this.tokens,o),this.binder.playerFinishedCounts.listTransition(k.map(e=>this.tokens.filter(t=>t.color===e&&t.step>=56).length));const r=this.activePlayer;this.binder.turnBanner.transition({activeColor:r.color,playerName:r.name,stage:this.stage,statusText:s}),this.saveToStorage()}showWinCelebrationModal(){var e;const s=document.getElementById("ludo-modal-overlay");if(!s)return;const o=[...this.players].sort((t,n)=>(t.rank??99)-(n.rank??99)||n.finishedCount-t.finishedCount),r=o.map((t,n)=>`
        <tr>
          <td>#${t.rank??n+1}</td>
          <td><span class="house-swatch" style="display:inline-block;background:${f[t.color]};margin-right:6px"></span><strong>${t.name}</strong></td>
          <td>${t.finishedCount} / 4</td>
          <td>⚔️ ${t.captures}</td>
        </tr>
      `).join("");s.innerHTML=`
      <div class="ludo-modal-card">
        <h3>🏆 Royal Pachisi — Final Standings</h3>
        <p class="ludo-modal-sub">Champion: <strong>${o[0].name}</strong>!</p>
        <table class="ludo-table">
          <thead>
            <tr><th>Rank</th><th>House</th><th>Home</th><th>Captures</th></tr>
          </thead>
          <tbody>${r}</tbody>
        </table>
        <div class="ludo-modal-actions">
          <button type="button" id="btn-close-win-modal" class="ludo-btn primary">Close</button>
        </div>
      </div>
    `,s.classList.remove("hidden"),(e=document.getElementById("btn-close-win-modal"))==null||e.addEventListener("click",()=>{s.classList.add("hidden")})}saveToStorage(){if(!(typeof window>"u"))try{const s={players:this.players,tokens:this.tokens,activePlayerIdx:this.activePlayerIdx,stage:this.stage==="waiting-for-move"?"waiting-for-roll":this.stage,currentDice:this.currentDice};window.localStorage.setItem(R,JSON.stringify(s))}catch{}}restoreFromStorage(){if(typeof window>"u")return!1;try{const s=window.localStorage.getItem(R);if(!s)return!1;const o=JSON.parse(s);return!Array.isArray(o.tokens)||o.tokens.length!==16?!1:(this.players=Array.isArray(o.players)?o.players:this.players,this.tokens=o.tokens,this.activePlayerIdx=typeof o.activePlayerIdx=="number"?o.activePlayerIdx:0,this.stage=o.stage??"waiting-for-roll",this.currentDice=o.currentDice??1,this.syncUI(`Resumed match — ${this.activePlayer.name}'s turn.`),!0)}catch{return!1}}static clearSavedMatch(){if(!(typeof window>"u"))try{window.localStorage.removeItem(R)}catch{}}}function ee(){return[{color:"red",name:"Crimson (You)",control:"human",finishedCount:0,captures:0},{color:"green",name:"Emerald Bot",control:"bot-aggressive",finishedCount:0,captures:0},{color:"yellow",name:"Amber Bot",control:"bot-safe",finishedCount:0,captures:0},{color:"blue",name:"Sapphire Bot",control:"bot-balanced",finishedCount:0,captures:0}]}function U(i=!1){var n,l,u,g;const s=document.getElementById("root");if(!s)return;i&&H.clearSavedMatch();const o=ee();s.innerHTML=K(o);const r=new Q,e=new H(o,r);i||e.restoreFromStorage();const t=()=>{e.activePlayer.control==="human"&&e.rollDice()};(n=document.getElementById("dice-box"))==null||n.addEventListener("click",t),(l=document.getElementById("btn-roll-dice"))==null||l.addEventListener("click",t),document.querySelectorAll(".ludo-token").forEach(p=>{p.addEventListener("mouseenter",()=>{const v=p.id,$=e.availableMoves.find(c=>c.tokenId===v),a=e.tokens.find(c=>c.id===v);$&&a&&X(a.color,a.tokenIdx,$.toStep)}),p.addEventListener("mouseleave",()=>{A()}),p.addEventListener("click",()=>{if(e.activePlayer.control!=="human")return;const v=p.id;A(),e.executeMove(v)})}),(u=document.getElementById("btn-rules"))==null||u.addEventListener("click",()=>{z()}),(g=document.getElementById("btn-new-match"))==null||g.addEventListener("click",()=>{U(!0)})}U(!1);
