import React, { useState, useEffect } from 'react'
import { Header, Footer } from "./components/index.js"
import { useDispatch } from 'react-redux'
import authService from "./backend/auth.js"
import connectionService from "./backend/connect.js"
import {login, logout} from "./store/authSlice.js"
import {initialiseUserHistory} from "./store/connectionSlice.js"
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {

    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(userData))
        connectionService.getUserHistory()
        .then(data => {
          dispatch(initialiseUserHistory(data.history))
        })
        .catch(error => {
          dispatch(initialiseUserHistory([{error: "Unable to fetch user history"}]))
        })
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className=''>
      <div className=''>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App

//One timing issue remains in App.jsx: the history request isn’t returned from the .then() callback. As a result, the outer .finally() sets loading to false as soon as the current-user check finishes, without waiting for history to load. The history may still arrive and update Redux afterward, but the app can render before it does. also do check for outer .catch catching the error for inner .then.

//Also, the fetchUserHistory thunk shown earlier has since been changed to terminateConnection in connectionSlice.js. That thunk is still faulty: it doesn’t await or return the terminateConnection() promise, so it can fulfill before the request finishes. It is not the history-fetching path currently used by App.jsx.
