import React from "react";

const SearchInput = ({ value, onChange, onKeyDown }) => {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Search artisan goods, workshops, scents..."
      className="flex-1 px-4 py-2 bg-white text-gray-900 placeholder:text-[#7B7B7B] border border-r-0 border-[#DCDCDC] rounded-l-xl focus:outline-none focus:border-[#BA5B55] text-sm transition-colors"
    />
  );
};

export default SearchInput;
