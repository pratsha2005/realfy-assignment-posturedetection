import React from 'react';
import "./home.css"
import { NavLink } from 'react-router-dom';
const HomePage = () => {
  return (

    <div id = "body" className="flex h-screen w-screen">
      {/* Left Image */}
      <div className="w-1/3 h-full" id = "pushups">
        <NavLink to={"pushups"}>

        
        <img
          src="src\assets\Pushups.jpg"
          alt="Left"
          className="object-cover w-full h-full"
        />
        </NavLink>
      </div>

      <div className="w-1/3 h-full flex items-center justify-center" id = "text">
        <h2 className="text-3xl text-center">
          Choose Squats or PushUps
        </h2>
      </div>

      {/* Right Image */}
      
      <div className="w-1/3 h-full" id = "squats">
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
