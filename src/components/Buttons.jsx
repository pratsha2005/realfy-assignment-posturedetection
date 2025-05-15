import React from 'react'

function Buttons({text, handler}) {
  return (
    <>
    <button onClick={handler}
    className="h-10/12 w-2xl mb-5 ml-5 mr-5"
    >
        {text}    
    </button>
    </>
  )
}

export default Buttons