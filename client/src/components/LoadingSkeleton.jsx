import React from "react";

// Shared constant for repeated class strings
const baseClass = "bg-zinc-700 rounded-md";

// Component for individual animated bars
const AnimatedBar = ({ width, marginBottom }) => {
  const style = `h-6 ${baseClass} ${width} ${marginBottom}`;
  return <div className={style}></div>;
};

// Main component that uses the AnimatedBar component
const LoadingSkeleton = () => {
  return (
    <div className='animate-pulse mt-2 w-full'>
      <AnimatedBar width='w-3/4' marginBottom='mb-4' />
      <AnimatedBar width='w-1/2' marginBottom='mb-4' />
      <AnimatedBar width='w-5/6' marginBottom='mb-4' />
      <AnimatedBar width='w-2/3' marginBottom='' />{" "}
    </div>
  );
};

export default LoadingSkeleton;
