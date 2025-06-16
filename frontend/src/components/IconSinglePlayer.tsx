import React from 'react';

const SinglePlayerIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
      {/* Head */}
      <circle cx="50" cy="40" r="8" fill="black" />
      {/* Body */}
      <path d="M42 65c0-5 4-9 8-9s8 4 8 9v6H42v-6z" fill="black" />
    </svg>
  );
};

export default SinglePlayerIcon;
