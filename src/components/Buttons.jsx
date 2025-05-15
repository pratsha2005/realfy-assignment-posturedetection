import React from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

function Buttons({text, handler}) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <button 
      onClick={handler}
      className={`${isMobile ? 'w-full mx-2 my-2' : 'h-10/12 w-2xl mb-5 ml-5 mr-5'} 
                  bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                  rounded transition-colors duration-200`}
    >
      {text}    
    </button>
  )
}

export default Buttons