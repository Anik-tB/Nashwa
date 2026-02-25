import React from "react";
import { Bell } from "@mynaui/icons-react";

const NotificationButton = () => {
  return (
    <button className="flex justify-center items-center p-2 text-[#1E180D] cursor-pointer hover:text-[#BA5B55] transition-colors group">
      <Bell size={24} />
    </button>
  );
};

export default NotificationButton;
