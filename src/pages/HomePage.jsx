import React from 'react';
import "./home.css";
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';

const HomePage = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div id="body" className={`flex ${isMobile ? 'flex-col' : 'h-screen w-screen'}`}>
      {/* Left Image */}
      <div className={`${isMobile ? 'w-full h-1/3 mb-4' : 'w-1/3 h-full'}`} id="pushups">
        <NavLink to={"pushups"} className="block h-full">
          <div className="relative h-full">
            <img
              src="./Pushups.jpg"
              alt="Push-ups"
              className="object-cover w-full h-full"
            />
            {isMobile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <h3 className="text-white text-2xl font-bold">Push-ups</h3>
              </div>
            )}
          </div>
        </NavLink>
      </div>

      {/* Center Text */}
      <div className={`${isMobile ? 'w-full py-6' : 'w-1/3 h-full'} flex items-center justify-center`} id="text">
        <h2 className="text-3xl text-center">
          Choose Squats or Push-Ups
        </h2>
      </div>

      {/* Right Image */}
      <div className={`${isMobile ? 'w-full h-1/3 mt-4' : 'w-1/3 h-full'}`} id="squats">
        <NavLink to={"squats"} className="block h-full">
          <div className="relative h-full">
            <img
              src="./Squats.webp"
              alt="Squats"
              className="object-cover w-full h-full"
            />
            {isMobile && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <h3 className="text-white text-2xl font-bold">Squats</h3>
              </div>
            )}
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;