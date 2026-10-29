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
      <button
        onClick={handleClick}
        className="rounded-lg border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-200/60 hover:bg-rose-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
        Disconnect
      </button>
    </div>
  )
}

export default EndConnectionBtn
