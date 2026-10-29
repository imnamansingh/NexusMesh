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
      <button
        onClick={logout}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
        Log Out
      </button> 
    </div>
  )
}

export default LogoutBtn
