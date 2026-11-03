import { createBrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import {
    AuthLayout,
    ConnectionLayout
} from "./components/index.js"

import {
  History,
  Home,
  Connection,
  ConnectionMap,
  About
} from "./pages/index.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "",
            element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path:"history",
          element: (
            <AuthLayout>
                <History />
            </AuthLayout>
          )
        },
        {
          path:"connect",
          element: (
            <AuthLayout>
              <ConnectionLayout connectionStatus={false}>
                <Connection />
              </ConnectionLayout>
            </AuthLayout>
          )
        },
        {
          path:"connection_map",
          element: (
            <AuthLayout>
              <ConnectionLayout connectionStatus>
                <ConnectionMap />
              </ConnectionLayout>
            </AuthLayout>
          )
        }
        
    ]
  }
])


export default router;