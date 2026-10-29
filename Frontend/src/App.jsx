import { useState, useEffect } from 'react'
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
        return connectionService.getUserHistory()
        .then(data => {
          dispatch(initialiseUserHistory(data.history))
        })
        .catch(error => {
          dispatch(initialiseUserHistory([{error: error.message}]))
        })
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(8,145,178,0.16),_transparent_45%)]">
        <Header />
        <main className="relative z-10 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
