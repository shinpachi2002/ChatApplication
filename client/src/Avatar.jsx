import React from "react";

const Avatar = ({ userId, username }) => {
  return (
    <div className="w-8 h-8 rounded-full bg-red-200 text-center items-center">
      {username[0]}
    </div>
  );
};

export default Avatar;
