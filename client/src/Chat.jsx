import React, { useEffect, useState } from 'react'

const Chat = () => {
  const[ws,setWs]=useState("");
  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:5000")
    setWs(ws);
    ws.addEventListener('message',handlemessage)
  },[])
  function handlemessage(e){
    const messageData=JSON.parse(e.data);
    if('online' in messageData){
      showpeopleOnline(messageData.online)
    }
   // e.data.text().then(messageString=>console.log(messageString))
  }
  return (
    <div className='h-screen flex'>
      <div className='w-1/3 bg-primary'>
        contacts
      </div>
      <div className='w-2/3 bg-secondary p-2 flex flex-col'>
        <div className='flex-grow'>Message with selected Person</div>
        <div className='flex gap-2 '>
          <input type="text" placeholder='Type Your Message Here' className='p-2 bg-white border rounded-md flex-grow' />
          <button className='bg-blue-500 p-2 text-white rounded-md'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat