import { createBrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import {
    Home
} from "./components/index.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
          path:"/history",
          element: (
            <AuthLayout authentication>
                <History />
            </AuthLayout>
          )
        }
        
    ]
  }
])


export default router;