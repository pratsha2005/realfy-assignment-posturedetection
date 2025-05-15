import React from 'react';
import { NavLink } from 'react-router-dom';
const HomePage = () => {
  return (

    <div className="flex h-screen w-screen">
      {/* Left Image */}
      <div className="w-1/2 h-full">
        <NavLink to={"pushups"}>

        
        <img
          src="src\assets\Pushups.jpg"
          alt="Left"
          className="object-cover w-full h-full"
        />
        </NavLink>
      </div>

      {/* Right Image */}
      
      <div className="w-1/2 h-full">
        <NavLink to={"squats"}>

        
        <img
          src="src\assets\Squats.webp"
          alt="Right"
          className="object-cover w-full h-full"
        />
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
