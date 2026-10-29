import React from 'react'
import LoginBtn from './LoginBtn.jsx'
import LogoutBtn from './LogoutBtn.jsx'
import EndConnectionBtn from './EndConnectionBtn.jsx'
import GetConnectedBtn from './GetConnectedBtn.jsx'
import { useSelector } from 'react-redux'
import Container from "../Container/Container.jsx"
import { NavLink } from 'react-router-dom'

function Header() {

  const userStatus = useSelector(state => state.auth.status)
  const activeStatus = useSelector(state => state.connection.activeStatus)

  const headerContent = [
    {
      name: "Log in",
      status: !userStatus,
      component: <LoginBtn/>
    },
    {
      name: "Log out",
      status: userStatus,
      component: <LogoutBtn/>
    },
    {
      name: "Connect",
      status: userStatus && !activeStatus,
      component: <GetConnectedBtn/>
    },
    {
      name: "Disconnect",
      status: userStatus && activeStatus,
      component:  <EndConnectionBtn/>
    }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 py-4 shadow-lg shadow-black/10 backdrop-blur-xl">
      <Container>
        <nav className="flex items-center justify-between">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">

            <NavLink 
              to="/"
              className={({isActive}) => `inline-flex items-center gap-2 text-lg font-black tracking-[0.18em] transition-colors ${isActive ? "text-cyan-300" : "text-slate-100 hover:text-cyan-300"}`}>
                  NexusMesh
              </NavLink>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {headerContent.map(content => content.status ? <React.Fragment key={content.name}>{content.component}</React.Fragment> : null)}

              {userStatus && 
                <NavLink 
                  to="/history"
                  className={({isActive}) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                    History
                </NavLink>
              }
            </div>

          </div>
        </nav>
      </Container>
    </header>
    
  )
}

export default Header
