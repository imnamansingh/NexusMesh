import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AuthLayout({
  children,
  connectionStatus = true
}) {

  const [loader, setLoader] = useState(true)
  const userStatus = useSelector(state => state.auth.status)
  const userConnectionStatus = useSelector(state => state.connection.activeStatus)
  const navigate = useNavigate()

  useEffect(() => {

    if(!userStatus){
      navigate("/")
    }
    else if(!userConnectionStatus && userConnectionStatus !== connectionStatus){
      navigate("/connection")
    }else if(userConnectionStatus && userConnectionStatus !== connectionStatus){
      navigate("/connection_map")
    }

    setLoader(false)

  },[userStatus, navigate, connectionStatus])

  return loader ? <div className="flex min-h-[50vh] items-center justify-center text-sm font-medium text-cyan-200">...Loading</div> : <>{children}</>
}

export default AuthLayout
