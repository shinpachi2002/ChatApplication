import React, { useContext, useState } from 'react'
import { useRef } from 'react'
import axios from "axios"
import { UserContext } from './UserContext';
const Register = () => {
  const username = useRef(null);
  const password = useRef(null);
  const { setUsername, setId } = useContext(UserContext);
  const [isloginorRegister, setLoginorRegister] = useState('register');
  async function HandleSubmit(e) {
    e.preventDefault();
    const url=isloginorRegister === 'register'? '/register' : '/login';
    try {
      const { data } = await axios.post(url, {
        username: username.current.value,
        password: password.current.value
      })
      setUsername(username.current.value);
      setId(data.id);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='bg-blue-50 flex flex-col items-center h-screen justify-center'>
      <h1 className='text-4xl font-bold mb-2'>Chat Me!</h1>
      <form action="" className='w-64 mx-auto mb-12' onSubmit={HandleSubmit}>
        <input type="text" name="" id="" placeholder='username' className='w-full mt-2 p-2 rounded-xl ' ref={username} />
        <input type="password" name="" id="" placeholder='password' className='w-full mt-2 p-2 rounded-xl' ref={password} />
        <button className='w-full bg-purple-100 mt-2 p-2 rounded-xl'>{isloginorRegister === 'register' ? "Register" : "Login"}</button>
        <div className='text-center mt-2'>
          {isloginorRegister === 'register' && (
            <div>
              Already a member ?
              <button className='hover:underline' onClick={() => setLoginorRegister('login')}>
                Login Here
              </button>
            </div>
          )}
          {isloginorRegister === 'login' && (
            <div>
              Dont Have a Account?
              <button className='hover:underline' onClick={() => setLoginorRegister('register')}>
                Register Here
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default Register
