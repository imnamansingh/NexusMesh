import React from 'react'
import { Container } from "../components/index.js"
import { NavLink } from "react-router-dom"


function Home() {
  return (
    <div className="py-10 sm:py-16 lg:py-20">
      <Container>
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-slate-900/70 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-16 lg:py-20">
            <div className="max-w-2xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
                A wireless mesh prototype
              </span>
              <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Connectivity,{' '}
                <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  reimagined
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                NexusMesh is a prototype for a decentralized physical infrastructure network. It models how nearby nodes can be discovered, connected into routes, and rewarded for service.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <NavLink
                  to="/about"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  More about NexusMesh
                  <span aria-hidden="true" className="ml-2 text-base">→</span>
                </NavLink>
                <span className="text-sm text-slate-400">
                  See how NexusMesh works
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl" role="img" aria-label="Illustration of wireless nodes connected in a mesh network">
              <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-3xl" />
              <svg
                viewBox="0 0 560 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative h-auto w-full drop-shadow-[0_20px_45px_rgba(8,145,178,0.12)]"
              >
                <defs>
                  <linearGradient id="mesh-line" x1="87" y1="91" x2="478" y2="339" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#67E8F9" stopOpacity=".75" />
                    <stop offset="1" stopColor="#3B82F6" stopOpacity=".35" />
                  </linearGradient>
                  <linearGradient id="mesh-node" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#A5F3FC" />
                    <stop offset="1" stopColor="#22D3EE" />
                  </linearGradient>
                  <pattern id="mesh-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#94A3B8" fillOpacity=".2" />
                  </pattern>
                </defs>

                <rect x="20" y="20" width="520" height="380" rx="28" fill="url(#mesh-grid)" />
                <path d="M92 106L202 164L326 93L447 155L382 278L246 322L111 274L202 164L382 278L447 155L326 93L246 322" stroke="url(#mesh-line)" strokeWidth="2" strokeDasharray="5 8" />
                <path d="M202 164L326 93M202 164L246 322M326 93L382 278M111 274L202 164" stroke="#67E8F9" strokeOpacity=".35" strokeWidth="1.5" />

                <g>
                  <circle cx="92" cy="106" r="25" fill="#083344" fillOpacity=".8" stroke="#22D3EE" strokeOpacity=".45" />
                  <circle cx="92" cy="106" r="7" fill="url(#mesh-node)" />
                  <path d="M82 95C87 89 97 89 102 95M86 100C89 97 95 97 98 100" stroke="#A5F3FC" strokeWidth="1.5" strokeLinecap="round" />
                </g>
                <g>
                  <circle cx="202" cy="164" r="31" fill="#083344" fillOpacity=".9" stroke="#67E8F9" strokeOpacity=".7" />
                  <circle cx="202" cy="164" r="10" fill="url(#mesh-node)" />
                  <circle cx="202" cy="164" r="17" stroke="#67E8F9" strokeOpacity=".22" />
                </g>
                <g>
                  <circle cx="326" cy="93" r="25" fill="#0F2444" fillOpacity=".9" stroke="#60A5FA" strokeOpacity=".55" />
                  <circle cx="326" cy="93" r="7" fill="#93C5FD" />
                  <path d="M316 82C321 76 331 76 336 82M320 87C323 84 329 84 332 87" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
                </g>
                <g>
                  <circle cx="447" cy="155" r="25" fill="#083344" fillOpacity=".8" stroke="#22D3EE" strokeOpacity=".45" />
                  <circle cx="447" cy="155" r="7" fill="url(#mesh-node)" />
                </g>
                <g>
                  <circle cx="111" cy="274" r="25" fill="#0F2444" fillOpacity=".9" stroke="#60A5FA" strokeOpacity=".55" />
                  <circle cx="111" cy="274" r="7" fill="#93C5FD" />
                  <path d="M101 263C106 257 116 257 121 263M105 268C108 265 114 265 117 268" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" />
                </g>
                <g>
                  <circle cx="246" cy="322" r="25" fill="#083344" fillOpacity=".8" stroke="#22D3EE" strokeOpacity=".45" />
                  <circle cx="246" cy="322" r="7" fill="url(#mesh-node)" />
                </g>
                <g>
                  <circle cx="382" cy="278" r="31" fill="#082F49" fillOpacity=".95" stroke="#22D3EE" strokeOpacity=".7" />
                  <circle cx="382" cy="278" r="10" fill="url(#mesh-node)" />
                  <circle cx="382" cy="278" r="17" stroke="#67E8F9" strokeOpacity=".22" />
                </g>

                <g className="fill-slate-900" fontFamily="ui-sans-serif, system-ui, sans-serif">
                  <rect x="29" y="343" width="142" height="38" rx="12" fill="#0F172A" fillOpacity=".9" stroke="#334155" />
                  <circle cx="47" cy="362" r="4" fill="#67E8F9" />
                  <text x="59" y="366" fill="#CBD5E1" fontSize="11" fontWeight="600">Connected nodes</text>
                  <rect x="362" y="42" width="154" height="38" rx="12" fill="#0F172A" fillOpacity=".9" stroke="#334155" />
                  <path d="M379 61H397" stroke="#67E8F9" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="406" y="65" fill="#CBD5E1" fontSize="11" fontWeight="600">Mesh routing</text>
                </g>
              </svg>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}

export default Home
