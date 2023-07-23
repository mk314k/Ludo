import React, { useState } from 'react'
import './App.css'

const ORIENTATION = ['horizontal', 'vertical'];
const HORIZONTAL = 0;
const VERTICAL = 1;
const colorOrientation = new Map([
  ['red', VERTICAL],
  ['yellow', VERTICAL],
  ['blue', HORIZONTAL],
  ['green', HORIZONTAL]
]);
type COLOR = 'red'|'yellow'|'green'|'blue'
class MovingPadCell{
  constructor(public readonly hasButton:boolean, public readonly special:string){

  }
}
const movingPad = new Map<COLOR, MovingPadCell[]>([
  [
    'red', Array.from(
      {length:18}, (_, index)=> new MovingPadCell(
        false,
        index === 3? 'star' :index === 5? 'colored star': index>2 && index%3==1 ? 'colored':'default'
      )
    )
  ],
  [
    'blue', Array.from(
      {length:18}, (_, index)=> new MovingPadCell(
        false,
        index === 13? 'star' :index === 1? 'colored star': index>6 && index<12 ? 'colored':'default'
      )
    )
  ],
  [
    'green', Array.from(
      {length:18}, (_, index)=> new MovingPadCell(
        false,
        index === 4? 'star' :index === 16? 'colored star': index>5 && index<11 ? 'colored':'default'
      )
    )
  ],
  [
    'yellow', Array.from(
      {length:18}, (_, index)=> new MovingPadCell(
        false,
        index === 14? 'star' :index === 12? 'colored star': index<15 && index%3==1 ? 'colored':'default'
      )
    )
  ]
]);

function MovingPad({ color }: { color: COLOR }) {
  const colrStyle = {
    '--color' : color
  } as React.CSSProperties;
  return (
    <>
      <div className={`movingpad-container ${ORIENTATION[colorOrientation.get(color)??0]}`} style = {colrStyle}>
      {movingPad.get(color)?.map((cell, index) => (
        <div key={index} className={`movingpad-cell ${cell.special}`}>
          {`${cell.hasButton ? '<div class="cell-button"></div>':''}`}
        </div>
      ))}
      </div>
    </>
  );
}


function StartPad({ color }: { color: string }) {
  const colrStyle = {
    '--color' : color
  } as React.CSSProperties;
  return (
    <>
      <div className='startpad-outer' style = {colrStyle}>
        <div className='startpad-inner'>
          <div className='startpad-button button'></div>
          <div className='startpad-button'></div>
          <div className='startpad-button button'></div>
          <div className='startpad-button'></div>
        </div>
      </div>
    </>
  );
}

function Home(){
  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1; // Generate a random number between 1 and 6
  };
  const [dice, setDice] = useState(rollDice());
  const diceDisplay = [
    [0,0,0,0,1,0,0,0,0],
    [0,0,1,0,0,0,1,0,0],
    [0,0,1,0,1,0,1,0,0],
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,1],
    [1,0,1,1,0,1,1,0,1]
  ];

  return (
    <>
      <div className='home'>
        <div className='dice' onClick={() => {setDice(rollDice())}}>
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index + 1}
              id = {`dot-${index}`}
              className={`dot ${diceDisplay[dice-1][index] === 1 ? 'visible' : 'invisible'}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  const [chance, setChance] = useState('red');

  return (
    <>
      <div className='game-board'>
        <StartPad color='blue'/>
        <MovingPad color='red'/>
        <StartPad color='red'/>
        <MovingPad color='blue'/>
        <Home />
        <MovingPad color='green'/>
        <StartPad color='yellow'/>
        <MovingPad color='yellow'/>
        <StartPad color='green'/>
      </div>
    </>
  )
}

export default App
