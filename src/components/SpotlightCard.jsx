import { useRef, useState, useCallback } from 'react'

export default function SpotlightCard({
  children,
  className = '',
  spotlightSize = 600,
  spotlightOpacity = 0.06,
  spotlightColor = '194, 155, 127', // Sand RGB
  ...rest
}) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        '--mouse-x': `${pos.x}px`,
        '--mouse-y': `${pos.y}px`,
      }}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at var(--mouse-x) var(--mouse-y), rgba(${spotlightColor},${spotlightOpacity}), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
