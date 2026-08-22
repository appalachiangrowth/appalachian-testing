'use client'

import { useMemo, useEffect, useState, useCallback, useRef } from 'react'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

interface StarDef {
  id: number; left: number; top: number; size: number
  baseOpacity: number; glow: number; duration: number; delay: number
  layer: number; isAccent: boolean; twinkleSpeed: number
}

function generateStars(count: number): StarDef[] {
  const rng = seededRandom(42)
  const stars: StarDef[] = []
  for (let i = 0; i < count; i++) {
    const r = rng()
    const layer = r < 0.45 ? 1 : r < 0.75 ? 2 : 3
    const sizeBase = layer === 1 ? 0.6 : layer === 2 ? 1.2 : 2
    const size = sizeBase + rng() * (layer === 3 ? 2.5 : layer === 2 ? 1.5 : 0.8)
    stars.push({
      id: i, left: rng() * 120 - 10, top: rng() * 120 - 10, size,
      baseOpacity: layer === 1 ? 0.5 + rng() * 0.35 : layer === 2 ? 0.6 + rng() * 0.3 : 0.8 + rng() * 0.2,
      glow: size > 3 ? 3 + rng() * 5 : size > 2 ? 1.5 + rng() * 2.5 : size > 1.2 ? 0.3 + rng() * 1.2 : 0,
      duration: layer === 1 ? 60 + rng() * 40 : layer === 2 ? 38 + rng() * 28 : 22 + rng() * 18,
      delay: -(rng() * 100), layer, isAccent: rng() > 0.8, twinkleSpeed: 1.5 + rng() * 3.5,
    })
  }
  return stars
}

function generateShootingStars(count: number) {
  const rng = seededRandom(99)
  return Array.from({ length: count }, (_, i) => ({
    id: i, left: 5 + rng() * 85, duration: 1.5 + rng() * 2.2,
    delay: i * 6 + rng() * 5, isAccent: i < 3, size: 2 + rng() * 2,
  }))
}

function CrescentMoon({ scrollY }: { scrollY: number }) {
  const visibility = Math.min(0.85, Math.max(0, (scrollY - 80) / 250))
  const yShift = Math.min(scrollY * 0.05, 50)
  const xShift = Math.sin(scrollY * 0.001) * 10
  return (
    <div className='fixed z-0 pointer-events-none' style={{
      top: '4%', right: '6%', opacity: visibility,
      transform: `translate(${xShift}px, ${-yShift}px)`, transition: 'opacity 0.3s ease',
    }} aria-hidden='true'>
      <svg width='180' height='180' viewBox='0 0 180 180' fill='none'>
        <circle cx='65' cy='90' r='70' fill='rgba(255,255,230,0.025)' filter='url(#moonGlow3)' />
        <circle cx='65' cy='90' r='55' fill='rgba(255,255,240,0.04)' filter='url(#moonGlow2)' />
        <circle cx='65' cy='90' r='45' fill='rgba(255,255,240,0.03)' filter='url(#moonGlow)' />
        <circle cx='65' cy='90' r='45' fill='rgba(255,255,245,0.18)' />
        <circle cx='83' cy='82' r='40' fill='#050505' />
        <circle cx='42' cy='78' r='6' fill='rgba(255,255,240,0.045)' />
        <circle cx='52' cy='105' r='4' fill='rgba(255,255,240,0.035)' />
        <circle cx='36' cy='92' r='3' fill='rgba(255,255,240,0.03)' />
        <circle cx='48' cy='66' r='2.5' fill='rgba(255,255,240,0.04)' />
        <circle cx='55' cy='86' r='2' fill='rgba(255,255,240,0.025)' />
        <circle cx='40' cy='100' r='1.8' fill='rgba(255,255,240,0.02)' />
        <circle cx='65' cy='90' r='45' fill='none' stroke='rgba(182,255,0,0.08)' strokeWidth='1.5' />
        <circle cx='65' cy='90' r='47' fill='none' stroke='rgba(182,255,0,0.03)' strokeWidth='3' />
        <defs>
          <filter id='moonGlow' x='-80%' y='-80%' width='260%' height='260%'>
            <feGaussianBlur stdDeviation='12' result='b' />
            <feComposite in='SourceGraphic' in2='b' operator='over' />
          </filter>
          <filter id='moonGlow2' x='-80%' y='-80%' width='260%' height='260%'>
            <feGaussianBlur stdDeviation='20' result='b' />
            <feComposite in='SourceGraphic' in2='b' operator='over' />
          </filter>
          <filter id='moonGlow3' x='-100%' y='-100%' width='300%' height='300%'>
            <feGaussianBlur stdDeviation='30' />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

function NebulaClouds() {
  return (
    <>
      <div className='absolute' style={{
        top: '5%', left: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(100,60,180,0.06) 0%, rgba(60,30,120,0.03) 40%, transparent 70%)',
        filter: 'blur(40px)', animation: 'nebulaDrift1 80s ease-in-out infinite',
      }} />
      <div className='absolute' style={{
        top: '30%', right: '-15%', width: '700px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(182,255,0,0.04) 0%, rgba(0,180,120,0.02) 40%, transparent 70%)',
        filter: 'blur(50px)', animation: 'nebulaDrift2 100s ease-in-out infinite',
      }} />
      <div className='absolute' style={{
        bottom: '10%', left: '20%', width: '800px', height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(30,60,150,0.05) 0%, rgba(20,20,80,0.025) 45%, transparent 70%)',
        filter: 'blur(60px)', animation: 'nebulaDrift3 90s ease-in-out infinite',
      }} />
      <div className='absolute' style={{
        top: '15%', right: '10%', width: '350px', height: '350px',
        background: 'radial-gradient(ellipse at center, rgba(255,100,0,0.03) 0%, transparent 60%)',
        filter: 'blur(30px)', animation: 'nebulaDrift1 70s ease-in-out infinite reverse',
      }} />
    </>
  )
}

export default function StarField() {
  const stars = useMemo(() => generateStars(150), [])
  const shootingStars = useMemo(() => generateShootingStars(6), [])
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number>(0)

  const onScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY)
      rafRef.current = 0
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [onScroll])

  const layerShift = (layer: number) => {
    if (layer === 1) return scrollY * 0.005
    if (layer === 2) return scrollY * 0.015
    return scrollY * 0.035
  }

  return (
    <div className='fixed inset-0 z-0 pointer-events-none overflow-hidden' aria-hidden='true'>
      <div className='absolute inset-0 bg-grid-pattern' />
      <NebulaClouds />

      {[1, 2, 3].map((layer) => {
        const layerStars = stars.filter((s) => s.layer === layer)
        const shift = layerShift(layer)
        return (
          <div key={layer} className='absolute inset-[-15%]' style={{ transform: `translateY(${shift}px)` }}>
            {layerStars.map((star) => {
              const color = star.isAccent
                ? `rgba(182,255,0,${star.baseOpacity})`
                : `rgba(255,255,255,${star.baseOpacity})`
              const glowColor = star.isAccent
                ? `rgba(182,255,0,${star.baseOpacity * 0.5})`
                : `rgba(200,220,255,${star.baseOpacity * 0.4})`
              return (
                <span key={star.id} className='absolute rounded-full' style={{
                  left: `${star.left}%`, top: `${star.top}%`,
                  width: `${star.size}px`, height: `${star.size}px`,
                  backgroundColor: color,
                  boxShadow: star.glow > 0
                    ? `0 0 ${star.glow * 2}px ${star.glow * 0.6}px ${glowColor}`
                    : 'none',
                  animation: `starFall${layer} ${star.duration}s linear ${star.delay}s infinite, starTwinkle ${star.twinkleSpeed}s ease-in-out ${star.delay * 0.03}s infinite`,
                }} />
              )
            })}
          </div>
        )
      })}

      {shootingStars.map((s) => (
        <span key={`sh-${s.id}`} className='absolute rounded-full' style={{
          left: `${s.left}%`, top: 0,
          width: `${s.size}px`, height: `${s.size}px`,
          backgroundColor: s.isAccent ? 'rgba(182,255,0,1)' : 'rgba(255,255,255,1)',
          boxShadow: `0 0 12px 4px ${s.isAccent ? 'rgba(182,255,0,0.7)' : 'rgba(200,220,255,0.7)'}`,
          animation: `starShoot ${s.duration}s ease-out ${s.delay}s infinite`,
        }} />
      ))}

      {/* Space Machines — temporarily disabled due to Turbopack HMR parse issues */}
      {/* <Spaceship1 />
      <Spaceship2 />
      <FighterCraft />
      <CargoShip />
      <Satellite />
      <SpaceStation />
      <SpaceProbe /> */}

      <CrescentMoon scrollY={scrollY} />
    </div>
  )
}
