import { createBrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import {
    AuthLayout,
} from "./components/index.js"

import {
  History,
  Home,
  Connection,
  ConnectionMap
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
            <AuthLayout connectionStatus={false}>
                <Connection />
            </AuthLayout>
          )
        },
        {
          path:"connection_map",
          element: (
            <AuthLayout connectionStatus>
                <ConnectionMap />
            </AuthLayout>
          )
        }
        
    ]
  }
])


export default router;