import React from 'react'

//Intl is JavaScript’s built-in internationalization API. It provides locale-aware formatting for dates, numbers, and other values. Here we are using its DateTimeFormat property which is a A constructor function that creates an object for formatting dates and times.
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
})

function formatDate(value) {
  if (!value) return 'Unavailable'

  const date = new Date(value)
  //date.getTime() gives back time passed from 1 Jan, 1970 in milliseconds
  return Number.isNaN(date.getTime()) ? 'Unavailable' : dateFormatter.format(date)
}

function formatDuration(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return 'Unavailable'

  const totalSeconds = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`
  return `${remainingSeconds}s`
}

function formatLocation(latitude, longitude) {
  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude)
  ) {
    return 'Unavailable'
  }

  //toFixed() formats a number with a set number of digits after the decimal point and returns the result as a string.
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}

function HistoryTab({
  sessionId,
  sessionStartTime,
  sessionEndTime,
  totalSessionTime,
  totalCost,
  totalBandwidthUsed,
  userLat,
  userLon,
  nodeLat,
  nodeLon
}) {
  return (
    <article className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/10 transition hover:border-cyan-300/25 sm:p-7">
      <h2 className="text-lg font-semibold text-white">Connection session</h2>
      <p className="mt-3 break-all rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 font-mono text-xs text-slate-400">Session ID: {sessionId || 'Unavailable'}</p>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"> {/* description list: a group of terms and their descriptions or values. dt tag for description term, or label and dd tag for description/value*/}
        
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Started</dt>
          <dd className="mt-2 text-sm text-slate-200">{formatDate(sessionStartTime)}</dd>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ended</dt>
          <dd className="mt-2 text-sm text-slate-200">{formatDate(sessionEndTime)}</dd>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</dt>
          <dd className="mt-2 text-sm text-slate-200">{formatDuration(totalSessionTime)}</dd>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total cost</dt>
          <dd className="mt-2 text-sm font-medium text-cyan-200">{totalCost}</dd>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bandwidth used</dt>
          <dd className="mt-2 text-sm text-slate-200">{totalBandwidthUsed} GB</dd>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your location</dt>
          <dd className="mt-2 text-sm text-slate-200">{formatLocation(userLat, userLon)}</dd>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Node location</dt>
          <dd className="mt-2 text-sm text-slate-200">{formatLocation(nodeLat, nodeLon)}</dd>
        </div>
      </dl>
    </article>
  )
}

export default HistoryTab