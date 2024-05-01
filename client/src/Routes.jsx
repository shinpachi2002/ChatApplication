import React, { useContext } from 'react'
import Register from './Register'
import { UserContext } from './UserContext'

const Routes = () => {
    const{username}=useContext(UserContext);
    if(username){
        return "logged in" + username
    }
  return (
    <div>
        <Register></Register>
    </div>
  )
}

export default Routes