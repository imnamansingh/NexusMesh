import { NavLink } from "react-router-dom"
import { Container } from "../components/index.js"

const journey = [
  {
    number: "01",
    title: "Sign in with a wallet",
    description:
      "The user connects a wallet and signs a short-lived challenge to prove control of the address.",
    label: "Wallet authentication",
  },
  {
    number: "02",
    title: "Describe a connection",
    description:
      "The app sends a requested location, bandwidth, and maximum latency to the Orchestrator.",
    label: "Connection request",
  },
  {
    number: "03",
    title: "Select a candidate route",
    description:
      "The Orchestrator asks the C++ Engine to search its node graph for a route that fits the request.",
    label: "Graph-based routing",
  },
  {
    number: "04",
    title: "Record the session",
    description:
      "When the session ends, the Ledger service requests token settlement through the contract.",
    label: "Settlement and history",
  },
]

const components = [
  {
    name: "Frontend",
    detail:
      "React app for wallet login, connection requests, route details, and session history.",
    tech: "React · MetaMask",
  },
  {
    name: "Orchestrator",
    detail:
      "Node.js service that verifies wallet challenges, validates requests, coordinates node records, and calls other services.",
    tech: "Node.js · Express · MongoDB",
  },
  {
    name: "Mesh Engine",
    detail:
      "C++ service that maintains a node graph, searches for candidate paths, and tracks modeled bandwidth reservations.",
    tech: "C++ · gRPC",
  },
  {
    name: "Ledger service",
    detail:
      "Calculates session cost, calls the settlement contract, and saves session history.",
    tech: "Node.js · Express · PostgreSQL",
  },
  {
    name: "Smart contracts",
    detail:
      "Solidity contracts define the MESH token, node registration, and approved token transfers for settlement.",
    tech: "Solidity · EVM",
  },
  {
    name: "Data stores",
    detail:
      "MongoDB stores node metadata; PostgreSQL stores settled session records.",
    tech: "MongoDB · PostgreSQL",
  },
]

function About() {
  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          <section className="relative isolate overflow-hidden rounded-4xl border border-cyan-300/15 bg-slate-900/70 px-6 py-12 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:px-10 sm:py-16 lg:px-14">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                About the project
              </span>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                A mesh network,{" "}
                <span className="bg-linear-to-r from-cyan-200 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  from idea to prototype.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                NexusMesh explores how a decentralized physical infrastructure
                network could coordinate wireless nodes, select connection
                routes, and settle usage. The current project is a prototype:
                it demonstrates the software flow, not a live network carrying
                real user traffic.
              </p>
            </div>
          </section>

          <section aria-labelledby="journey-heading" className="mt-16 sm:mt-20">
            <div className="mb-7 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                The user journey
              </p>
              <h2
                id="journey-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                How a connection request flows
              </h2>
              <p className="mt-3 leading-7 text-slate-400">
                Each step is handled by a separate part of the application.
              </p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {journey.map((step) => (
                <li
                  key={step.number}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6"
                >
                  <span className="text-sm font-black tracking-[0.16em] text-cyan-300">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>
                  <span className="mt-5 inline-flex rounded-full border border-white/10 bg-white/3 px-3 py-1 text-xs font-medium text-slate-300">
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="architecture-heading" className="mt-16 sm:mt-20">
            <div className="mb-7 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                Under the hood
              </p>
              <h2
                id="architecture-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                The pieces that make up NexusMesh
              </h2>
              <p className="mt-3 leading-7 text-slate-400">
                The app is organized as a monorepo with distinct services that
                communicate through HTTP, gRPC, and EVM transactions.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {components.map((component) => (
                <article
                  key={component.name}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-colors hover:border-cyan-300/20 sm:p-6"
                >
                  <h3 className="text-lg font-bold text-white">
                    {component.name}
                  </h3>
                  <p className="mt-3 min-h-18 text-sm leading-6 text-slate-400">
                    {component.detail}
                  </p>
                  <p className="mt-5 border-t border-white/10 pt-4 text-xs font-medium tracking-wide text-cyan-200/80">
                    {component.tech}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="prototype-heading" className="mt-16 sm:mt-20">
            <div className="mb-7 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">
                Current scope
              </p>
              <h2
                id="prototype-heading"
                className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                What the prototype does—and doesn’t do
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-emerald-300/15 bg-emerald-300/4 p-6 sm:p-7">
                <h3 className="flex items-center gap-3 text-lg font-bold text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300/10 text-sm text-emerald-300">
                    +
                  </span>
                  Implemented in the prototype
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                  <li>Wallet-signature login and authenticated connection requests.</li>
                  <li>Node metadata storage and graph-based candidate route selection.</li>
                  <li>Separate frontend, Orchestrator, Engine, and Ledger services.</li>
                  <li>Smart-contract interfaces for node registration and token settlement.</li>
                </ul>
              </article>
              <article className="rounded-2xl border border-amber-300/15 bg-amber-300/4 p-6 sm:p-7">
                <h3 className="flex items-center gap-3 text-lg font-bold text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300/10 text-sm text-amber-200">
                    !
                  </span>
                  Still simulated
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                  <li>Development node distribution generates synthetic node details and locations.</li>
                  <li>Route selection models a path; it does not forward real network traffic between physical devices.</li>
                  <li>Bandwidth usage at session end is currently generated randomly, not measured from traffic.</li>
                  <li>The local development blockchain is a Hardhat test chain, not a production network.</li>
                </ul>
              </article>
            </div>
            <p className="mt-5 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm leading-6 text-slate-400">
              In short: NexusMesh demonstrates how a DePIN-style wireless
              network could be coordinated. It should not yet be presented as a
              live decentralized connectivity service.
            </p>
          </section>
        </div>
      </Container>
    </div>
  )
}

export default About
