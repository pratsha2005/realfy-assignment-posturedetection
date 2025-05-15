import React from 'react'

function Card({angle1, angle2, text1, text2}) {
  return (
    
    <div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <p class="font-normal text-gray-700 dark:text-gray-400">
        {text1} : {angle1}
        <br />
       {text2} : {angle2}
    </p>
    </div>
  )
}

export default Card