import React, { useState, useEffect } from 'react'
import { Header, Footer } from "./components/index.js"
import { useDispatch } from 'react-redux'
import authService from "./backend/auth.js"
import {login, logout} from "./store/authSlice.js"
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(userData))
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
