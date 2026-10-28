import React from 'react'
import { useDispatch } from 'react-redux'
import { setActiveStatus, terminateConnection } from '../../store/connectionSlice'

function EndConnectionBtn() {

    const dispatch = useDispatch()

    const handleClick = () => {
        try {
            dispatch(setActiveStatus(false))
            dispatch(terminateConnection())
        } catch (error) {
            console.log(error.message)
        }
    }
  return (
    <div>
      <button onClick={handleClick}>
        Disconnect
      </button>
    </div>
  )
}

export default EndConnectionBtn
