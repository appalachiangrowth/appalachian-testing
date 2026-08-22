'use client'

/* ---- Spaceship 1 — sleek cruiser ---- */
export function Spaceship1() {
  return (
    <div className='absolute' style={{ top: '18%', left: '-120px', animation: 'shipFly1 45s linear infinite' }}>
      <svg width='80' height='30' viewBox='0 0 80 30' fill='none' className='opacity-25'>
        <defs>
          <filter id='eng1' x='-100%' y='-200%' width='300%' height='500%'><feGaussianBlur stdDeviation='4' /></filter>
        </defs>
        <ellipse cx='8' cy='15' rx='10' ry='4' fill='rgba(182,255,0,0.4)' filter='url(#eng1)' />
        <ellipse cx='5' cy='15' rx='6' ry='2.5' fill='rgba(182,255,0,0.8)' />
        <path d='M12 15 L35 5 L75 12 L75 18 L35 25 Z' fill='rgba(150,160,180,0.5)' stroke='rgba(200,210,230,0.3)' strokeWidth='0.5' />
        <ellipse cx='60' cy='15' rx='8' ry='4' fill='rgba(100,180,255,0.2)' stroke='rgba(100,180,255,0.4)' strokeWidth='0.5' />
        <path d='M20 15 L28 2 L35 12 Z' fill='rgba(120,130,150,0.4)' />
        <path d='M20 15 L28 28 L35 18 Z' fill='rgba(120,130,150,0.4)' />
        <line x1='40' y1='10' x2='70' y2='10' stroke='rgba(200,210,230,0.15)' strokeWidth='0.5' />
        <line x1='40' y1='20' x2='70' y2='20' stroke='rgba(200,210,230,0.15)' strokeWidth='0.5' />
      </svg>
    </div>
  )
}

/* ---- Spaceship 2 — scout ship ---- */
export function Spaceship2() {
  return (
    <div className='absolute' style={{ top: '55%', right: '-100px', animation: 'shipFly2 60s linear 10s infinite' }}>
      <svg width='60' height='20' viewBox='0 0 60 20' fill='none' className='opacity-20' style={{ transform: 'scaleX(-1)' }}>
        <defs>
          <filter id='eng2' x='-100%' y='-200%' width='300%' height='500%'><feGaussianBlur stdDeviation='3' /></filter>
        </defs>
        <ellipse cx='6' cy='10' rx='8' ry='3' fill='rgba(255,150,50,0.5)' filter='url(#eng2)' />
        <ellipse cx='4' cy='10' rx='4' ry='2' fill='rgba(255,200,100,0.9)' />
        <path d='M10 10 L25 3 L55 8 L55 12 L25 17 Z' fill='rgba(180,140,100,0.4)' stroke='rgba(220,180,120,0.3)' strokeWidth='0.5' />
        <path d='M16 10 L22 2 L28 8 Z' fill='rgba(160,120,80,0.35)' />
        <path d='M16 10 L22 18 L28 12 Z' fill='rgba(160,120,80,0.35)' />
        <circle cx='42' cy='10' r='3' fill='rgba(100,200,255,0.15)' stroke='rgba(100,200,255,0.3)' strokeWidth='0.5' />
      </svg>
    </div>
  )
}

/* ---- Satellite with solar panels ---- */
export function Satellite() {
  return (
    <div className='absolute' style={{ top: '35%', left: '60%', animation: 'satelliteOrbit 50s linear infinite' }}>
      <svg width='50' height='24' viewBox='0 0 50 24' fill='none' className='opacity-20'>
        <rect x='0' y='6' width='14' height='12' rx='1' fill='rgba(40,60,120,0.5)' stroke='rgba(80,120,200,0.3)' strokeWidth='0.5' />
        <line x1='3.5' y1='6' x2='3.5' y2='18' stroke='rgba(80,120,200,0.2)' strokeWidth='0.3' />
        <line x1='7' y1='6' x2='7' y2='18' stroke='rgba(80,120,200,0.2)' strokeWidth='0.3' />
        <line x1='10.5' y1='6' x2='10.5' y2='18' stroke='rgba(80,120,200,0.2)' strokeWidth='0.3' />
        <rect x='14' y='11' width='5' height='2' fill='rgba(150,160,180,0.4)' />
        <rect x='19' y='5' width='12' height='14' rx='2' fill='rgba(160,170,190,0.4)' stroke='rgba(200,210,230,0.3)' strokeWidth='0.5' />
        <circle cx='25' cy='12' r='2' fill='rgba(182,255,0,0.3)' />
        <line x1='25' y1='5' x2='25' y2='0' stroke='rgba(200,210,230,0.3)' strokeWidth='0.5' />
        <circle cx='25' cy='0' r='1' fill='rgba(255,100,100,0.4)' />
        <rect x='31' y='11' width='5' height='2' fill='rgba(150,160,180,0.4)' />
        <rect x='36' y='6' width='14' height='12' rx='1' fill='rgba(40,60,120,0.5)' stroke='rgba(80,120,200,0.3)' strokeWidth='0.5' />
        <line x1='39.5' y1='6' x2='39.5' y2='18' stroke='rgba(80,120,200,0.2)' strokeWidth='0.3' />
        <line x1='43' y1='6' x2='43' y2='18' stroke='rgba(80,120,200,0.2)' strokeWidth='0.3' />
        <line x1='46.5' y1='6' x2='46.5' y2='18' stroke='rgba(80,120,200,0.2)' strokeWidth='0.3' />
      </svg>
    </div>
  )
}

/* ---- Space Station ---- */
export function SpaceStation() {
  return (
    <div className='absolute' style={{ top: '8%', left: '30%', animation: 'stationDrift 120s linear infinite' }}>
      <svg width='120' height='40' viewBox='0 0 120 40' fill='none' className='opacity-15'>
        <rect x='40' y='14' width='40' height='12' rx='4' fill='rgba(160,170,190,0.3)' stroke='rgba(200,210,230,0.2)' strokeWidth='0.5' />
        <circle cx='50' cy='20' r='1.5' fill='rgba(100,200,255,0.3)' />
        <circle cx='56' cy='20' r='1.5' fill='rgba(100,200,255,0.3)' />
        <circle cx='62' cy='20' r='1.5' fill='rgba(100,200,255,0.3)' />
        <circle cx='68' cy='20' r='1.5' fill='rgba(100,200,255,0.3)' />
        <rect x='20' y='18' width='20' height='4' rx='1' fill='rgba(150,160,180,0.3)' />
        <rect x='2' y='10' width='18' height='20' rx='1' fill='rgba(40,60,120,0.35)' stroke='rgba(80,120,200,0.2)' strokeWidth='0.5' />
        <line x1='6' y1='10' x2='6' y2='30' stroke='rgba(80,120,200,0.15)' strokeWidth='0.3' />
        <line x1='10' y1='10' x2='10' y2='30' stroke='rgba(80,120,200,0.15)' strokeWidth='0.3' />
        <line x1='14' y1='10' x2='14' y2='30' stroke='rgba(80,120,200,0.15)' strokeWidth='0.3' />
        <rect x='80' y='18' width='20' height='4' rx='1' fill='rgba(150,160,180,0.3)' />
        <rect x='100' y='10' width='18' height='20' rx='1' fill='rgba(40,60,120,0.35)' stroke='rgba(80,120,200,0.2)' strokeWidth='0.5' />
        <line x1='104' y1='10' x2='104' y2='30' stroke='rgba(80,120,200,0.15)' strokeWidth='0.3' />
        <line x1='108' y1='10' x2='108' y2='30' stroke='rgba(80,120,200,0.15)' strokeWidth='0.3' />
        <line x1='112' y1='10' x2='112' y2='30' stroke='rgba(80,120,200,0.15)' strokeWidth='0.3' />
        <rect x='55' y='8' width='10' height='6' rx='2' fill='rgba(150,160,180,0.25)' />
        <rect x='50' y='26' width='20' height='6' rx='2' fill='rgba(140,150,170,0.25)' stroke='rgba(200,210,230,0.15)' strokeWidth='0.5' />
        <circle cx='60' cy='8' r='1' fill='rgba(255,50,50,0.6)' className='starfield-blink' />
      </svg>
    </div>
  )
}

/* ---- Space Probe / Drone ---- */
export function SpaceProbe() {
  return (
    <div className='absolute' style={{ top: '70%', left: '-60px', animation: 'probeDrift 35s linear 5s infinite' }}>
      <svg width='40' height='40' viewBox='0 0 40 40' fill='none' className='opacity-18'>
        <defs>
          <filter id='probeG' x='-100%' y='-50%' width='300%' height='200%'><feGaussianBlur stdDeviation='3' /></filter>
        </defs>
        <ellipse cx='20' cy='38' rx='3' ry='6' fill='rgba(182,255,0,0.3)' filter='url(#probeG)' />
        <polygon points='20,8 28,13 28,23 20,28 12,23 12,13' fill='rgba(160,170,190,0.35)' stroke='rgba(200,210,230,0.25)' strokeWidth='0.5' />
        <circle cx='20' cy='18' r='4' fill='rgba(30,40,60,0.5)' stroke='rgba(100,180,255,0.3)' strokeWidth='0.5' />
        <circle cx='20' cy='18' r='2' fill='rgba(182,255,0,0.3)' />
        <line x1='12' y1='13' x2='6' y2='8' stroke='rgba(200,210,230,0.3)' strokeWidth='0.5' />
        <line x1='28' y1='13' x2='34' y2='8' stroke='rgba(200,210,230,0.3)' strokeWidth='0.5' />
        <circle cx='6' cy='8' r='1.5' fill='rgba(200,210,230,0.2)' />
        <circle cx='34' cy='8' r='1.5' fill='rgba(200,210,230,0.2)' />
        <rect x='8' y='17' width='3' height='3' rx='0.5' fill='rgba(255,100,100,0.3)' />
        <rect x='29' y='17' width='3' height='3' rx='0.5' fill='rgba(100,100,255,0.3)' />
      </svg>
    </div>
  )
}

/* ---- Fighter Craft ---- */
export function FighterCraft() {
  return (
    <div className='absolute' style={{ top: '42%', right: '-80px', animation: 'fighterFly 28s linear 15s infinite' }}>
      <svg width='50' height='18' viewBox='0 0 50 18' fill='none' className='opacity-22' style={{ transform: 'scaleX(-1) rotate(-5deg)' }}>
        <ellipse cx='6' cy='7' rx='4' ry='2' fill='rgba(182,255,0,0.7)' />
        <ellipse cx='6' cy='7' rx='2' ry='1' fill='rgba(255,255,255,0.9)' />
        <ellipse cx='6' cy='11' rx='4' ry='2' fill='rgba(182,255,0,0.7)' />
        <ellipse cx='6' cy='11' rx='2' ry='1' fill='rgba(255,255,255,0.9)' />
        <path d='M10 9 L30 2 L48 8 L48 10 L30 16 Z' fill='rgba(140,150,170,0.45)' stroke='rgba(180,190,210,0.3)' strokeWidth='0.5' />
        <path d='M32 5 L42 8 L42 10 L32 13 Z' fill='rgba(80,160,255,0.2)' stroke='rgba(80,160,255,0.35)' strokeWidth='0.5' />
        <circle cx='30' cy='2' r='1' fill='rgba(255,50,50,0.5)' className='starfield-blink' />
        <circle cx='30' cy='16' r='1' fill='rgba(255,50,50,0.5)' className='starfield-blink' />
      </svg>
    </div>
  )
}

/* ---- Cargo Ship ---- */
export function CargoShip() {
  return (
    <div className='absolute' style={{ top: '80%', left: '70%', animation: 'cargoDrift 90s linear 20s infinite' }}>
      <svg width='100' height='35' viewBox='0 0 100 35' fill='none' className='opacity-12'>
        <defs>
          <filter id='cargoG' x='-100%' y='-100%' width='300%' height='300%'><feGaussianBlur stdDeviation='3' /></filter>
        </defs>
        <rect x='0' y='12' width='8' height='4' rx='1' fill='rgba(255,120,30,0.5)' />
        <rect x='0' y='19' width='8' height='4' rx='1' fill='rgba(255,120,30,0.5)' />
        <ellipse cx='-2' cy='14' rx='5' ry='2' fill='rgba(255,150,50,0.3)' filter='url(#cargoG)' />
        <ellipse cx='-2' cy='21' rx='5' ry='2' fill='rgba(255,150,50,0.3)' filter='url(#cargoG)' />
        <rect x='8' y='8' width='70' height='19' rx='3' fill='rgba(130,140,160,0.3)' stroke='rgba(180,190,210,0.2)' strokeWidth='0.5' />
        <rect x='15' y='11' width='25' height='13' rx='1' fill='rgba(80,90,110,0.3)' stroke='rgba(150,160,180,0.15)' strokeWidth='0.5' />
        <line x1='27.5' y1='11' x2='27.5' y2='24' stroke='rgba(150,160,180,0.15)' strokeWidth='0.3' />
        <rect x='78' y='10' width='18' height='15' rx='2' fill='rgba(150,160,180,0.35)' stroke='rgba(200,210,230,0.2)' strokeWidth='0.5' />
        <rect x='82' y='13' width='8' height='6' rx='1' fill='rgba(80,160,255,0.15)' stroke='rgba(80,160,255,0.25)' strokeWidth='0.5' />
        <line x1='87' y1='10' x2='87' y2='4' stroke='rgba(200,210,230,0.2)' strokeWidth='0.5' />
        <circle cx='8' cy='8' r='0.8' fill='rgba(255,50,50,0.5)' className='starfield-blink' />
        <circle cx='96' cy='10' r='0.8' fill='rgba(50,255,50,0.5)' className='starfield-blink-slow' />
      </svg>
    </div>
  )
}
