import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
//  const [count, setCount] = useState(0)

  return (
    <>
      <Container></Container>
      <Button></Button>
    </>
  )
}

let counter = 0;
function countUp(){
  counter = counter + 1;
}

const Container = () => {
  const [counter, setCounter] = useState(0);
  return (<div>
    <h3>Total clicks: {counter}</h3>
    <button onClick={() => setCounter((current) => current+1)} >Click me</button>
  </div>);
}

const Button = () => (
  <button
    style = {{backgroundColor: "tomato"}}
    onClick={() => console.log("im clicked")}
  >
    Click me
  </button>
)

export default App
