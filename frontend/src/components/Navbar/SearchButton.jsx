import React from "react";
import { Search } from "@mynaui/icons-react";

const SearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Search"
      className="px-4 py-2 bg-white text-[#7B7B7B] hover:text-white border border-[#DCDCDC] rounded-r-xl hover:bg-[#BA5B55] hover:border-[#BA5B55] transition-all duration-200 cursor-pointer flex items-center justify-center"
    >
      <Search size={18} />
    </button>
  );
};

export default SearchButton;
