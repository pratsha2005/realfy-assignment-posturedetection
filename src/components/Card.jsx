import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

function Card({ angle1, angle2, text1, text2 }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`${isMobile ? 'max-w-xs' : 'max-w-sm'} p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}>
      <p className={`font-normal text-gray-700 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-base'}`}>
        {text1}: {Math.round(angle1)}°
        <br />
        {text2}: {Math.round(angle2)}°
      </p>
    </div>
  );
}

export default Card;