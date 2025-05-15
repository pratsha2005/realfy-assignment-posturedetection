import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Squats from './pages/Squats'
import PushUps from './pages/PushUps'

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
    </Router>
  )
}

export default App