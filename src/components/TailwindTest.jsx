// src/components/TailwindTest.jsx
import React from "react";

const TailwindTest = () => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 mt-4">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-cochineal-red rounded-full"></div>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Tailwind Test</div>
        <p className="text-cement">
          If you see this styled properly, Tailwind is working!
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;
