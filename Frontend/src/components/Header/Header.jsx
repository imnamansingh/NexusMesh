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
    <header>
      <Container>
        <nav>
          <div>

            <NavLink 
              to="/" className={({isActive}) => `${isActive ? "text-orange-700" : "text-gray-700"}`}>
                Home
            </NavLink>

            {/*The shorthand fragment syntax <>...</> cant take a key, so use React.Fragment when mapping.*/}

            {headerContent.map(content => content.status ?<React.Fragment key={content.name}>{content.component}</React.Fragment> : null)}

            {/* Navlink is the one that provides objects as a param to callbacks written inside props, when you destructure that object you get that isActive property which tells if the current link is active by comparing it to current url, it doesnt account for property change on hovering, if you want that styling also, use hovering specific classes of tailwind */}
            {userStatus && 
              <NavLink 
                to="/history"
                className={({isActive}) => `${isActive ? "text-orange-700" : "text-gray-700"}`}>
                  History
              </NavLink>
            }

          </div>
        </nav>
      </Container>
    </header>
    
  )
}

export default Header
