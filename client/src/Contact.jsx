import React from 'react'
import Avatar from './Avatar'
const Contact = ({userId,selected,username,online,onClick}) => {
  return (
    <div>
        <div
              key={userId}
              onClick={()=>onClick(userId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md  cursor-pointer ${
                selected ? "bg-gray-400" : "bg-purple-100 "
              }`}
            >
              <Avatar userId={userId} online={online} username={username}></Avatar>
              <span className="text-gray-800">{username}</span>
            </div>
    </div>
  )
}

export default Contact