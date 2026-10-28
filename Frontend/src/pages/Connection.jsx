import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import connectionService from '../backend/connect.js'
import { setActiveStatus } from '../store/connectionSlice.js'
import Container from '../components/Container/Container.jsx'
import { useNavigate } from 'react-router-dom'
import {useForm} from "react-hook-form"
import Input from '../components/Input.jsx'

function Connection() {

    const [errorState, setErrorState] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()

    //whatever useSelector returns, it make this component subscribe to that field and if any property of that field changes, the component will re-render instantly.

    

    const userStatus = useSelector(state => state.auth.status)

    //names in data field comes from the first arg passed to register function
    const getConnected = async (data) => {

    try {

      setErrorState("") 
      if(!userStatus){
        throw new error("Login to get connected") 
      }

      const connectionData = await connectionService.getConnection(data)
      if(connectionData){
        dispatch(setActiveStatus(true))
        navigate("/")
      }
    } catch (error) {

      dispatch(setActiveStatus(false))
      setErrorState(error.message)  
      
    }
  }
  return (
    <div>
        <Container>
            { errorState && <p>{errorState}</p> }
            {/* you get this onSubmit arg in plain HTML also, named as onsubmit and it also takes a fn (as a string with parameters passed already like "function(param1, param2)") reference to execute it when form gets submitted.*/}
            <form onSubmit={handleSubmit(getConnected)}>
                <Input 
                    type="text" 
                    label="Latitude: " 
                    placeholder="Enter your latitude"
                    {...register("Latitude", {
                        required: true
                    })}
                />
                <Input 
                    type="text" 
                    label="Longitude: " 
                    placeholder="Enter your Longitude"
                    {...register("Longitude", {
                            required: true
                    })}
                />
                <Input 
                    type="text" 
                    label="Bandwidth: " 
                    placeholder="Enter the required bandwidth"
                    {...register("Bandwidth", {
                                required: true
                    })}
                />
                <Input 
                    type="text" 
                    label="Latency: " 
                    placeholder="Enter the maximum allowed latency"
                    {...register("Latency", {
                                required: true
                    })}
                />

                <button
                    type="submit">
                        submit
                </button>

            </form>

            
        </Container>
      
    </div>
  )
}

export default Connection
