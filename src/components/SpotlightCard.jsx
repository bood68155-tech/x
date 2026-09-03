import { useRef, useState, useCallback } from 'react'

/**
 * SpotlightCard – a bento-style card that renders a subtle radial gradient
 * spotlight following the user's cursor.  Uses CSS custom properties
 * --mouse-x / --mouse-y so the gradient can be defined purely in Tailwind /
 * inline styles, keeping the component tree lightweight.
 *
 * Accepts the same `className` pattern as a normal div – the caller supplies
 * the base bento-card styles, this component adds the spotlight layer.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightSize = 600,
  spotlightOpacity = 0.06,
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
      {/* Spotlight gradient layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,${spotlightOpacity}), transparent 40%)`,
        }}
      />
      {/* Content sits above the spotlight */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
