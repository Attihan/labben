import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Games from './pages/Games'
import Animations from './pages/Animations'
import Interactive from './pages/Interactive'
import About from './pages/About'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/animations" element={<Animations />} />
        <Route path="/interactive" element={<Interactive />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}