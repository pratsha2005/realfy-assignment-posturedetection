import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Squats from './pages/Squats'
import PushUps from './pages/PushUps'
import { useMediaQuery } from './hooks/useMediaQuery' // New import for responsive design

// NavBar Component for mobile navigation
const NavBar = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return isMobile ? (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 z-50 p-2">
      <div className="flex justify-around">
        <a href="/" className="text-white text-center px-4 py-2">
          Home
        </a>
        <a href="/squats" className="text-white text-center px-4 py-2">
          Squats
        </a>
        <a href="/pushups" className="text-white text-center px-4 py-2">
          Push-ups
        </a>
      </div>
    </nav>
  ) : null
}

function RoutesList(){
    return(
        <Routes>
            <Route path='/' element = {<HomePage/>}/>
            <Route path='squats' element = {<Squats/>}/>
            <Route path='pushups' element = {<PushUps/>}/>
        </Routes>
    )
}

function App() {
  return (
    <Router>
        <RoutesList/>
        <NavBar /> {/* Added navigation bar for mobile */}
    </Router>
  )
}

export default App