import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Update the state initially
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    // Create a listener for changes
    const listener = () => {
      setMatches(media.matches)
    }
    
    // Add the listener to the media query
    media.addEventListener('change', listener)
    
    // Clean up the listener when component unmounts
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [matches, query])

  return matches
}