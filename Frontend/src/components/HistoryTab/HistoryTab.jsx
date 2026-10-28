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
    <article>
      <h2>Connection session</h2>
      <p>Session ID: {sessionId || 'Unavailable'}</p>

      <dl> {/* description list: a group of terms and their descriptions or values. dt tag for description term, or label and dd tag for description/value*/}
        
        <dt>Started</dt>
        <dd>{formatDate(sessionStartTime)}</dd>

        <dt>Ended</dt>
        <dd>{formatDate(sessionEndTime)}</dd>

        <dt>Duration</dt>
        <dd>{formatDuration(totalSessionTime)}</dd>

        <dt>Total cost</dt>
        <dd>{totalCost}</dd>

        <dt>Bandwidth used</dt>
        <dd>{totalBandwidthUsed} GB</dd>

        <dt>Your location</dt>
        <dd>{formatLocation(userLat, userLon)}</dd>

        <dt>Node location</dt>
        <dd>{formatLocation(nodeLat, nodeLon)}</dd>
      </dl>
    </article>
  )
}

export default HistoryTab