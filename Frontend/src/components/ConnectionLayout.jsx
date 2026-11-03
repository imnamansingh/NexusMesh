import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ConnectionLayout({children, connectionStatus = true}) {

    const [loader, setLoader] = useState(true)
    const navigate = useNavigate()
    const userStatus = useSelector( state => state.connection.activeStatus )

    useEffect(() => {

        if( !userStatus && userStatus !== connectionStatus ){

            navigate("/")

        }else if( userStatus && userStatus!= connectionStatus ){

            navigate("/connection_map")
        }

        setLoader(false)

    },[userStatus, navigate, connectionStatus])

  return loader ? <div className="flex min-h-[50vh] items-center justify-center text-sm font-medium text-cyan-200">...Loading</div> : <>{children}</>
}

export default ConnectionLayout
