import React from 'react'

function HistoryErrorTab({error}) {
  return (
    <div className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/5 p-5 text-rose-200 shadow-lg shadow-black/10">
      <p className="text-sm leading-6">{error}</p>
    </div>
  )
}

export default HistoryErrorTab
