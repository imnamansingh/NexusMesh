import { useNavigate } from "react-router-dom"




function GetConnectedBtn() {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/connect")
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
        Connect
      </button>
    </div>
  )
}

export default GetConnectedBtn
