import React from 'react'
import { useRef } from 'react'
import axios from "axios"
const Register = () => {
  const username = useRef(null);
  const password = useRef(null);

  async function formvaluedisplay(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/register", {
        username: username.current.value,
        password: password.current.value
      })
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='bg-blue-50 flex items-center h-screen'>
      <form action="" className='w-64 mx-auto mb-12' onSubmit={formvaluedisplay}>
        <input type="text" name="" id="" placeholder='username' className='w-full mt-2 p-2 rounded-xl ' ref={username} />
        <input type="password" name="" id="" placeholder='password' className='w-full mt-2 p-2 rounded-xl' ref={password} />
        <button className='w-full bg-purple-100 mt-2 p-2 rounded-xl'>Register</button>
      </form>
    </div>
  )
}

export default Register
