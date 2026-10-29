import React from 'react'
import Container from '../components/Container/Container'

function Home() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-900/70 px-6 py-14 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              Welcome to NexusMesh
            </h1>
          </div>
        </section>
      </Container>
      
    </div>
  )
}

export default Home
