import React from 'react'
import { logout as userLogout} from '../../store/authSlice.js'
import authService from '../../backend/auth.js'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveStatus, initialiseUserHistory, terminateConnection } from '../../store/connectionSlice.js'

function LogoutBtn() {

  const dispatch = useDispatch()
  const activeStatus = useSelector(state => state.connection.activeStatus)

  const logout = async () => {
    try {

      const logoutData = await authService.logout()

      if(logoutData){

        dispatch(userLogout())

        if(activeStatus){
          dispatch(setActiveStatus(false))
          dispatch(terminateConnection())
        }
        dispatch(initialiseUserHistory([]))
        
      }

    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div>
      <button onClick={logout}>
        Log Out
      </button> 
    </div>
  )
}

export default LogoutBtn
