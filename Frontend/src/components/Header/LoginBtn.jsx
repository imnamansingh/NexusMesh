import React from 'react'
import authService from '../../backend/auth.js'
import connectionService from '../../backend/connect.js'
import { useDispatch } from 'react-redux'
import {login as userLogin, logout} from "../../store/authSlice.js"
import { initialiseUserHistory } from '../../store/connectionSlice.js'

function LoginBtn() {

  const dispatch = useDispatch()

  const login = async() => {
    try {
      const userData = await authService.login()

      if(userData){

        dispatch(userLogin(userData))
        
        try {
          const userHistory = await connectionService.getUserHistory()
          dispatch(initialiseUserHistory(userHistory.history))
        } catch (error) {
          dispatch(initialiseUserHistory([{error: error.message}]))
        }

      }
      else{
        dispatch(logout())
      }

    } catch (error) {

      console.log(error.message)
    }
  }


  return (
    <div>
      <button onClick={login}>
        Log In
      </button>   
    </div>
  )
}

export default LoginBtn
