import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import App from "./App.jsx"
import {
    Home,
    Login,
    HistoryTab
} from "./components/index.js"

const route = createBrowserRouter(
    createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='login' element={<Login />} />
    </Route>
  )
)


export default route;