import React from 'react'
import LoginBtn from './LoginBtn.jsx'
import LogoutBtn from './LogoutBtn.jsx'
import GetConnectedBtn from './GetConnectedBtn.jsx'
import EndConnectionBtn from './EndConnectionBtn.jsx'
import { useSelector } from 'react-redux'
import Container from "../Container/Container.jsx"
import { NavLink } from 'react-router-dom'


function Header() {

  const userStatus = useSelector(state => state.auth.status)
  const activeStatus = useSelector(state => state.connection.activeStatus)

  const headerAuthContent = [
    {
      name: "Log in",
      status: !userStatus,
      component: <LoginBtn/>
    },
    {
      name: "Log out",
      status: userStatus,
      component: <LogoutBtn/>
    }
  ]

  const headerContent = [
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
              aria-label="NexusMesh home"
              className={({isActive}) => `inline-flex items-center rounded-xl transition-opacity hover:opacity-80 ${isActive ? "opacity-100" : "opacity-85"}`}>
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="nexus-mesh-logo" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#A5F3FC" />
                      <stop offset="1" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M10 30V10L30 30V10"
                    stroke="url(#nexus-mesh-logo)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 20H30"
                    stroke="url(#nexus-mesh-logo)"
                    strokeWidth="1.5"
                    strokeDasharray="2 3"
                    strokeLinecap="round"
                    opacity=".7"
                  />
                  <circle cx="10" cy="10" r="4" fill="#A5F3FC" />
                  <circle cx="30" cy="10" r="4" fill="#67E8F9" />
                  <circle cx="10" cy="30" r="4" fill="#22D3EE" />
                  <circle cx="30" cy="30" r="4" fill="#60A5FA" />
                  <circle cx="20" cy="20" r="2.5" fill="#E0F2FE" />
                </svg>
              </NavLink>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <NavLink
                to="/about"
                className={({isActive}) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                About
              </NavLink>
              {headerContent.map(content => content.status ? <React.Fragment key={content.name}>{content.component}</React.Fragment> : null)}

              {
                (userStatus && activeStatus) &&
                <NavLink
                  to="/connection_map"
                  className={({isActive}) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                  View route
                </NavLink>
              }

              {userStatus && 
                <NavLink 
                  to="/history"
                  className={({isActive}) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                    History
                </NavLink>
              }

              {headerAuthContent.map(content => content.status ? <React.Fragment key={content.name}>{content.component}</React.Fragment> : null)}
              
            </div>

          </div>
        </nav>
      </Container>
    </header>
    
  )
}

export default Header
