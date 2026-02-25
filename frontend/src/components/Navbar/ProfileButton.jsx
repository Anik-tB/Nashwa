import React from "react";
import { UserCircle } from "@mynaui/icons-react";

const ProfileButton = () => {
  return (
    <button className="relative p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors group">
      <UserCircle size={24} />
    </button>
  );
};

export default ProfileButton;
