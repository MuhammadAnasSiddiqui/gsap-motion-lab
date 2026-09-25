import React, { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const DEFAULT_COLORS = {
  wave: '#F0F8FE',
  streak: '#ffffff',
}

// Feet (and the U-turns between arches) sit well below the viewBox bottom (1100),
// so the stroke reads as one endless painted wave.
const FOOT_Y = 1300
const STROKE = 200

// Peak (px, py) plus left/right foot x. Shorter on the left, taller on the right.
const ARCHES = [
  { px: 150, py: 295, lx: -60, rx: 380 },
  { px: 640, py: 285, lx: 470, rx: 830 },
  { px: 1165, py: 175, lx: 975, rx: 1410 },
  { px: 1715, py: 175, lx: 1500, rx: 1920 },
]

// Dry-brush bristle gaps: [stroke width, dash pattern, dash offset].
// A slightly wider dashed streak colour is drawn, then the wave colour just inside it,
// which leaves thin broken lines running exactly parallel to the stroke edge.
const BRISTLES = [
  [STROKE - 6, '120 380 40 260 300 700 80 500', 0],
  [STROKE - 22, '40 520 160 340 70 900', 250],
  [STROKE - 50, '60 900 180 1200 40 600', 400],
  [STROKE - 120, '30 1400 90 1100', 900],
]

// One continuous path: up each arch, over its peak, down, then a hidden U-turn into the next.
const buildWavePath = (arches) => {
  const first = arches[0]
  let d = `M ${first.lx - 300} ${FOOT_Y} C ${first.lx - 300} ${FOOT_Y + 160} ${first.lx} ${FOOT_Y + 160} ${first.lx} ${FOOT_Y}`

  arches.forEach((a, i) => {
    const hl = a.px - a.lx
    const hr = a.rx - a.px
    const shoulderY = a.py + (FOOT_Y - a.py) * 0.35
    const nextX = arches[i + 1] ? arches[i + 1].lx : a.rx + 300

    d += ` C ${a.lx + hl * 0.4} ${shoulderY} ${a.px - hl * 0.62} ${a.cy} ${a.px} ${a.py}`
    d += ` C ${a.px + hr * 0.62} ${a.cy} ${a.rx - hr * 0.4} ${shoulderY} ${a.rx} ${FOOT_Y}`
    d += ` C ${a.rx} ${FOOT_Y + 160} ${nextX} ${FOOT_Y + 160} ${nextX} ${FOOT_Y}`
  })

  return d
}

const restPath = buildWavePath(ARCHES.map((a) => ({ ...a, cy: a.py })))

const BrushWaveBackground = ({
  colors = {},
  speed = 1,
  amplitude = 1,
  texture = true,
  className = '',
}) => {
  const uid = useId().replace(/:/g, '')
  const svgRef = useRef(null)
  const groupRef = useRef(null)
  const pathRef = useRef(null)

  // Latest prop values, read by the ticker without restarting the animation.
  const settings = useRef({ speed, amplitude })
  useEffect(() => {
    settings.current = { speed, amplitude }
  }, [speed, amplitude])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      let elapsed = 0
      const tick = (_time, deltaTime) => {
        const { speed: speedMul, amplitude: ampMul } = settings.current
        elapsed += (deltaTime / 1000) * speedMul

        const moved = ARCHES.map((a, i) => {
          const t = elapsed * (0.55 + i * 0.08) + i * 0.9
          const dy = Math.sin(t) * 26 * ampMul
          const dx = Math.cos(t) * 14 * ampMul
          const footDx = Math.sin(t * 0.8) * 4 * ampMul
          return {
            px: a.px + dx,
            py: a.py + dy,
            cy: a.py + dy * 0.75, // control points trail the peak
            lx: a.lx + dx * 0.25 + footDx,
            rx: a.rx + dx * 0.25 - footDx,
          }
        })

        pathRef.current.setAttribute('d', buildWavePath(moved))
      }

      gsap.ticker.add(tick)
      gsap.to(groupRef.current, {
        y: 12,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      return () => gsap.ticker.remove(tick)
    },
    { scope: svgRef }
  )

  const pathId = `brush-wave-${uid}`
  const filterId = `brush-rough-${uid}`
  const waveStroke = { stroke: 'var(--wave-color)' }
  const streakStroke = { stroke: 'var(--wave-streak)' }

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '--wave-color': colors.wave ?? `var(--brush-wave-color, ${DEFAULT_COLORS.wave})`,
        '--wave-streak': colors.streak ?? `var(--brush-wave-streak, ${DEFAULT_COLORS.streak})`,
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1920 1100"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <defs>
          <path ref={pathRef} id={pathId} d={restPath} />
          {texture && (
            <filter
              id={filterId}
              filterUnits="userSpaceOnUse"
              x="-200"
              y="-200"
              width="2320"
              height="1500"
            >
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.0025" numOctaves="4" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="16" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          )}
        </defs>

        <g ref={groupRef}>
          <g fill="none" filter={texture ? `url(#${filterId})` : undefined}>
            <use href={`#${pathId}`} strokeWidth={STROKE} style={waveStroke} />
            {texture &&
              BRISTLES.map(([width, dash, offset]) => (
                <React.Fragment key={width}>
                  <use
                    href={`#${pathId}`}
                    strokeWidth={width + 3}
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                    style={streakStroke}
                  />
                  <use href={`#${pathId}`} strokeWidth={width - 3} style={waveStroke} />
                </React.Fragment>
              ))}
          </g>
        </g>
      </svg>
    </div>
  )
}

export default BrushWaveBackground
