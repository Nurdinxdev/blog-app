import React, { useRef, useEffect } from "react";

const Dropdown = ({ isOpen, close, children }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, close]);

  return (
    <div className='relative' ref={dropdownRef}>
      {isOpen && (
        <div className='absolute right-0 mt-2 rounded-md overflow-hidden shadow-md z-10'>
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
