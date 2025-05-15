import React from 'react'
import Buttons from '../components/Buttons'
function HomePage() {
  const squatHandler = () => {

  }
  const pushUpHandler = () => {

  }
  return (
    <>
    <Buttons text = "Start Squats" handler = {squatHandler}/>
    <Buttons text = "Start PushUps" handler = {pushUpHandler}/>
    </>
  )
}

export default HomePage