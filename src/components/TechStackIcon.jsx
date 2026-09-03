import { useState } from 'react'

/**
 * Brand colour map – each tech gets a subtle neon glow on hover.
 * The glow uses the brand's primary colour at low opacity.
 */
const BRAND_COLORS = {
  HTML5:       { color: '#E34F26', bg: 'rgba(227,79,38,0.12)',  border: 'rgba(227,79,38,0.25)' },
  CSS3:        { color: '#1572B6', bg: 'rgba(21,114,182,0.12)', border: 'rgba(21,114,182,0.25)' },
  JavaScript:  { color: '#F7DF1E', bg: 'rgba(247,223,30,0.12)', border: 'rgba(247,223,30,0.25)' },
  React:       { color: '#61DAFB', bg: 'rgba(97,218,251,0.12)', border: 'rgba(97,218,251,0.25)' },
  'Tailwind CSS': { color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)' },
  'Node.js':   { color: '#68A063', bg: 'rgba(104,160,99,0.12)', border: 'rgba(104,160,99,0.25)' },
  Supabase:    { color: '#3ECF8E', bg: 'rgba(62,207,142,0.12)', border: 'rgba(62,207,142,0.25)' },
  Firebase:    { color: '#FFCA28', bg: 'rgba(255,202,40,0.12)', border: 'rgba(255,202,40,0.25)' },
  MySQL:       { color: '#4479A1', bg: 'rgba(68,121,161,0.12)', border: 'rgba(68,121,161,0.25)' },
  n8n:         { color: '#EA4B71', bg: 'rgba(234,75,113,0.12)', border: 'rgba(234,75,113,0.25)' },
  'Make.com':  { color: '#6D28D9', bg: 'rgba(109,40,217,0.12)', border: 'rgba(109,40,217,0.25)' },
  GitHub:      { color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)' },
  Vercel:      { color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)' },
  'VS Code':   { color: '#007ACC', bg: 'rgba(0,122,204,0.12)', border: 'rgba(0,122,204,0.25)' },
  'Golden Asseal': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  'E-Commerce': { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  Accounting:   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' },
  'Digital Marketing': { color: '#F472B6', bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.25)' },
  'Workflow Integration': { color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.25)' },
}

const DEFAULT_COLOR = { color: '#A1A1AA', bg: 'rgba(161,161,170,0.08)', border: 'rgba(161,161,170,0.15)' }

export default function TechStackIcon({ name, icon, ar = false }) {
  const [hovering, setHovering] = useState(false)
  const brand = BRAND_COLORS[name] || DEFAULT_COLOR

  return (
    <span
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`
        inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
        border transition-all duration-300 cursor-default select-none
        ${ar ? 'text-xs' : ''}
      `}
      style={{
        backgroundColor: hovering ? brand.bg : 'rgba(255,255,255,0.03)',
        borderColor: hovering ? brand.border : 'rgba(255,255,255,0.06)',
        color: hovering ? brand.color : '#D4D4D8',
        boxShadow: hovering
          ? `0 0 20px ${brand.bg}, 0 0 40px ${brand.bg.replace('0.12', '0.06')}`
          : 'none',
      }}
    >
      <span className="text-sm">{icon}</span>
      {name}
    </span>
  )
}
