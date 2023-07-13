import React, { useState } from 'react'
import './App.css'

function StartPad({ color }: { color: string }) {
  const [c, setC] = useState(0);
  const colrStyle = {
    '--color' : color
  } as React.CSSProperties;
  return (
    <>
      <div className='startpad-outer' style = {colrStyle}>
        <div className='startpad-inner'>
          <div className='startpad-button-place'></div>
          <div className='startpad-button-place'></div>
          <div className='startpad-button-place'></div>
          <div className='startpad-button-place'></div>
        </div>
      </div>
    </>
  );
}
function MovingPad({ color }: { color: string }) {
  const [c, setC] = useState(0);
  const colrStyle = {
    '--color' : color
  } as React.CSSProperties;
  return (
    <>
      <div className='movingpad-container' style = {colrStyle}>
      {[...Array(18)].map((_, index) => (
        <div key={index} className='movingpad-cell'></div>
      ))}
      </div>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='game-board'>
        <StartPad color='blue'/>
        <MovingPad color='red'/>
        <StartPad color='red'/>
        <MovingPad color='blue'/>
        <div></div>
        <MovingPad color='green'/>
        <StartPad color='yellow'/>
        <MovingPad color='yellow'/>
        <StartPad color='green'/>
      </div>
    </>
  )
}

export default App
