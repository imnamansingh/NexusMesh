import React from 'react'
import { Container } from "../components/index.js";
import { useSelector } from 'react-redux';

function ConnectionMap() {

  const userStatus = useSelector(state => state.connection.activeStatus)
  const nodeArray = useSelector(state => state.connection.ConnectionMap)

  return (
    <Container>
        <main className="py-12 sm:py-16">
          {(userStatus && !(nodeArray.length)) ? <p className="mx-auto max-w-4xl rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">Error: unable to fetch connection route data</p> : 
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Connection Route
              </h1>
              <ol className="grid gap-4">
                {nodeArray.map((node, index) => (
                  <li key={node.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur sm:p-6">
                    <h2 className="mb-4 text-lg font-bold text-cyan-300">Node {index + 1}{node.isGateway ? " — Gateway" : ""}</h2>
                    <p className="break-all text-sm text-slate-300">Wallet: {node.walletAddress}</p>
                    <p className="break-all text-sm text-slate-300">IP address: {node.ipAddress}</p>
                    <p className="text-sm text-slate-300">Location: {node.lat}, {node.lon}</p>
                    <p className="text-sm text-slate-300">Bandwidth: {node.totalBandwidth} Gbps</p>
                    <p className="text-sm text-slate-300">Maximum latency: {node.maxLatency} ms</p>
                  </li>
                ))}
              </ol>
            </div>
          }
          

        </main>
    </Container>
   
  )
}

export default ConnectionMap
