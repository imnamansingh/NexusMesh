import { useNavigate } from "react-router-dom"




function GetConnectedBtn() {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/connect")
  }

  return (
    <div>
      <button onClick={handleClick}>
        Connect
      </button>
    </div>
  )
}

export default GetConnectedBtn
