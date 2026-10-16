import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function StartupReveal({
  visible,
  children,
}: {
  visible: boolean
  children: React.ReactNode
}) {
  const reducedMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(visible)

  return (
    <div className="startup-window-surface relative h-dvh">
      <div className="h-full" inert={!revealed} aria-hidden={!revealed}>
        {children}
      </div>
      {!revealed && (
        <motion.div
          data-slot="startup-cover"
          aria-hidden
          className="startup-window-surface fixed inset-0 z-[100]"
          initial={false}
          animate={{ opacity: visible ? 0 : 1 }}
          transition={{
            delay: reducedMotion ? 0 : 0.3,
            duration: reducedMotion ? 0 : 0.3,
            ease: 'easeInOut',
          }}
          onAnimationComplete={() => {
            if (visible) setRevealed(true)
          }}
        />
      )}
    </div>
  )
}
