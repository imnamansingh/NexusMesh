import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AuthLayout({
  children
}) {

  const [loader, setLoader] = useState(true)
  const userStatus = useSelector(state => state.auth.status)
  const navigate = useNavigate()

  useEffect(() => {

    if(!userStatus){
      navigate("/")
    }

    setLoader(false)

  },[userStatus, navigate])

  return loader ? <div className="flex min-h-[50vh] items-center justify-center text-sm font-medium text-cyan-200">...Loading</div> : <>{children}</>
}

export default AuthLayout
