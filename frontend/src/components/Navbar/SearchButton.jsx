import React from "react";
import { Search } from "@mynaui/icons-react";

const SearchButton = () => {
  return (
    <button className="px-6 py-2.5 bg-white text-[#7B7B7B] hover:text-white border-r border-t border-b border-[#DCDCDC]  hover:bg-[#C77F70] hover:border-[#C77F70] transition-colors duration-200 cursor-pointer flex items-center justify-center">
      <Search size={20} />
    </button>
  );
};

export default SearchButton;
