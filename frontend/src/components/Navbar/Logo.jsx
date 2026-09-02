import React from "react";

const Logo = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-0.5 items-center justify-center cursor-pointer select-none group"
    >
      <p className="text-xl font-extrabold tracking-wider text-[#BA5B55] leading-none text-center group-hover:opacity-90 transition-opacity">
        NASHWA
      </p>
      <p className="text-[10px] text-[#7B7B7B] tracking-widest leading-none text-center font-medium">
        THE PATH TO GROWTH
      </p>
    </div>
  );
};

export default Logo;
