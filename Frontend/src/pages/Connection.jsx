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
    <div className="py-12 sm:py-16">
        <Container>
            <div className="mx-auto max-w-3xl">
            { errorState && <p className="mb-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{errorState}</p> }
            {/* you get this onSubmit arg in plain HTML also, named as onsubmit and it also takes a fn (as a string with parameters passed already like "function(param1, param2)") reference to execute it when form gets submitted.*/}
            <form onSubmit={handleSubmit(getConnected)} className="grid grid-cols-1 gap-5 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 sm:grid-cols-2 sm:gap-6 sm:p-8">
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
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:col-span-2">
                        submit
                </button>

            </form>
            </div>
            
        </Container>
      
    </div>
  )
}

export default Connection
