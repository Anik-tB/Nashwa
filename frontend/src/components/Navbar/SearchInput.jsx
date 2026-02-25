import React from "react";

const SearchInput = () => {
  return (
    <input
      type="text"
      placeholder="What are you looking for?"
      className="flex-1 px-4 py-2.4 bg-white text-gray-900 placeholder:text-[#7B7B7B] border border-[#DCDCDC] focus:outline-none focus:border-[#C77F70]"
    />
  );
};

export default SearchInput;
