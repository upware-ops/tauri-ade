import tide from '@/assets/shaders/tide.glsl?raw'
import bloom from '@/assets/shaders/matrix-bloom.glsl?raw'
import orbit from '@/assets/shaders/perimeter-orbit.glsl?raw'
import { ShaderSurface } from '@/components/ui/shader-surface'
import { cn } from '@/lib/utils'

const animations = {
  tide: { source: tide, sequence: 0 },
  bloom: { source: bloom, sequence: 0 },
  orbit: { source: orbit, sequence: 0 },
  ripple: { source: bloom, sequence: 2 },
  comets: { source: orbit, sequence: 2 },
}

function Throbber({
  animation = 'tide',
  play = true,
  speed = 1,
  phase = 0,
  interpolation = 0,
  reverse = false,
  ink = [167 / 255, 167 / 255, 167 / 255],
  opacity = 1,
  resting = 0,
  capture = false,
  size = 15,
  className,
  style,
  ...props
}: React.ComponentProps<'span'> & {
  animation?: keyof typeof animations
  play?: boolean
  speed?: number
  phase?: number
  interpolation?: number
  reverse?: boolean
  ink?: number[]
  opacity?: number
  resting?: number
  capture?: boolean
  size?: number
}) {
  const route = animations[animation]

  return (
    <span
      data-slot="throbber"
      className={cn('relative inline-flex shrink-0', className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <ShaderSurface
        source={route.source}
        animated={play}
        fallback={`/design/throbber-${animation}.png`}
        className="size-full"
        uniforms={{
          u_sequence: route.sequence === 0 && capture ? 1 : route.sequence,
          u_play: play ? 1 : 0,
          u_speed: Math.min(3, Math.max(0.25, speed)),
          u_phase: Math.min(1, Math.max(0, phase)),
          u_blend: Math.min(1, Math.max(0, interpolation)),
          u_reverse: reverse ? 1 : 0,
          u_ink: ink,
          u_opacity: Math.min(1, Math.max(0, opacity)),
          u_rest: Math.min(0.25, Math.max(0, resting)),
        }}
      />
    </span>
  )
}

export { Throbber }
