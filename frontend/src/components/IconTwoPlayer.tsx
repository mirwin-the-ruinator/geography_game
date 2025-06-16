import React from 'react';

const TwoPlayerIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Circular Border */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="black"
        strokeWidth="4"
        fill="white"
      />
      {/* Left Person */}
      <circle cx="35" cy="40" r="8" fill="black" />
      <path d="M27 65c0-5 4-9 9-9s9 4 9 9v6H27v-6z" fill="black" />
      {/* Right Person */}
      <circle cx="65" cy="40" r="8" fill="black" />
      <path d="M57 65c0-5 4-9 9-9s9 4 9 9v6H57v-6z" fill="black" />
    </svg>
  );
};

export default TwoPlayerIcon;
