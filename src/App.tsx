import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToDo from './pages/ToDo.tsx'
import CoinTracker from './pages/CoinTracker.tsx'
import MovieApp from './pages/MovieApp.tsx'
import Home from './pages/Home.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie" element={<MovieApp />} />
      <Route path="/coin" element={<CoinTracker />} />
      <Route path="/todo" element={<ToDo />} />
    </Routes>
  )
}

export default App
