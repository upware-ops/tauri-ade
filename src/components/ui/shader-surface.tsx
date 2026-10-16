import { useEffect, useRef } from 'react'
import neuralMesh from '@/assets/shaders/neural-mesh.glsl?raw'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'

export const NEURAL_MESH_LOOP_SECONDS = 5

const MESH_UNIFORMS = {
  u_signal: [167 / 255, 173 / 255, 1],
  u_highlight: [154 / 255, 240 / 255, 220 / 255],
  u_motion: 1,
  u_phase: 0,
  u_period: NEURAL_MESH_LOOP_SECONDS,
  u_pitch: 6,
}

interface ShaderSurfaceProps {
  source?: string
  uniforms?: Record<string, number | number[]>
  animated?: boolean
  fallback?: string
  className?: string
  onFirstLoopComplete?: () => void
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    logger.warn('Failed to compile a design shader', {
      error: gl.getShaderInfoLog(shader),
    })
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function ShaderSurface({
  source = neuralMesh,
  uniforms = MESH_UNIFORMS,
  animated = true,
  fallback,
  className,
  onFirstLoopComplete,
}: ShaderSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elapsedRef = useRef(0)
  const settingsRef = useRef({ uniforms, animated })
  const synchronizeRef = useRef<(() => void) | null>(null)
  const loopCallbackRef = useRef(onFirstLoopComplete)
  const fallbackImage =
    fallback ??
    (source === neuralMesh ? '/design/splash-fallback.webp' : undefined)

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const canvas = element
    canvas.style.opacity = '0'
    canvas.dataset.renderer = 'fallback'
    let firstLoopComplete = false

    function completeFirstLoop() {
      if (firstLoopComplete) return
      firstLoopComplete = true
      loopCallbackRef.current?.()
    }

    const context = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    })
    if (!context) {
      completeFirstLoop()
      return
    }
    const gl = context

    const vertex = compileShader(
      gl,
      gl.VERTEX_SHADER,
      'attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }'
    )
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, source)
    const program = gl.createProgram()
    const buffer = gl.createBuffer()

    if (!vertex || !fragment || !program || !buffer) {
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      if (program) gl.deleteProgram(program)
      if (buffer) gl.deleteBuffer(buffer)
      completeFirstLoop()
      return
    }

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      logger.warn('Failed to link a design shader', {
        error: gl.getProgramInfoLog(program),
      })
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
      completeFirstLoop()
      return
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )

    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const locations = new Map<
      string,
      { location: WebGLUniformLocation | null; type: number }
    >()
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let index = 0; index < uniformCount; index++) {
      const uniform = gl.getActiveUniform(program, index)
      if (uniform) {
        locations.set(uniform.name, {
          location: gl.getUniformLocation(program, uniform.name),
          type: uniform.type,
        })
      }
    }

    const resolution = gl.getUniformLocation(program, 'u_resolution')
    const time = gl.getUniformLocation(program, 'u_time')
    const maxSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let intersecting = true
    let contextLost = false
    let frame = 0
    let previousTime = 0

    function render(now: number) {
      if (previousTime) {
        elapsedRef.current += Math.min((now - previousTime) / 1000, 0.1)
      }
      previousTime = now

      gl.useProgram(program)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, elapsedRef.current)

      for (const [name, value] of Object.entries(
        settingsRef.current.uniforms
      )) {
        const uniform = locations.get(name)
        if (!uniform) continue

        if (typeof value === 'number') {
          if (uniform.type === gl.INT || uniform.type === gl.BOOL) {
            gl.uniform1i(uniform.location, value)
          } else {
            gl.uniform1f(uniform.location, value)
          }
        } else if (value.length === 2) {
          gl.uniform2fv(uniform.location, value)
        } else if (value.length === 3) {
          gl.uniform3fv(uniform.location, value)
        } else if (value.length === 4) {
          gl.uniform4fv(uniform.location, value)
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3)
      canvas.style.opacity = '1'
      canvas.dataset.renderer = 'webgl'

      const period = settingsRef.current.uniforms.u_period
      if (
        reducedMotion.matches ||
        (typeof period === 'number' && elapsedRef.current >= period)
      ) {
        completeFirstLoop()
      }

      if (settingsRef.current.animated && !reducedMotion.matches) {
        frame = requestAnimationFrame(render)
      }
    }

    function synchronize() {
      cancelAnimationFrame(frame)
      previousTime = 0
      if (document.hidden || !intersecting || contextLost) return

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return

      const scale = Math.min(
        window.devicePixelRatio || 1,
        2,
        Math.sqrt(4_000_000 / (width * height)),
        maxSize / width,
        maxSize / height
      )
      const pixelWidth = Math.max(1, Math.round(width * scale))
      const pixelHeight = Math.max(1, Math.round(height * scale))

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
        gl.viewport(0, 0, pixelWidth, pixelHeight)
      }

      render(performance.now())
    }

    function loseContext() {
      contextLost = true
      cancelAnimationFrame(frame)
      canvas.style.opacity = '0'
      canvas.dataset.renderer = 'fallback'
      completeFirstLoop()
    }

    const resizeObserver = new ResizeObserver(synchronize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? false
      synchronize()
    })

    synchronizeRef.current = synchronize
    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    document.addEventListener('visibilitychange', synchronize)
    window.addEventListener('resize', synchronize)
    reducedMotion.addEventListener('change', synchronize)
    canvas.addEventListener('webglcontextlost', loseContext)
    synchronize()

    return () => {
      cancelAnimationFrame(frame)
      synchronizeRef.current = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', synchronize)
      window.removeEventListener('resize', synchronize)
      reducedMotion.removeEventListener('change', synchronize)
      canvas.removeEventListener('webglcontextlost', loseContext)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [source])

  useEffect(() => {
    loopCallbackRef.current = onFirstLoopComplete
  }, [onFirstLoopComplete])

  useEffect(() => {
    settingsRef.current = { uniforms, animated }
    synchronizeRef.current?.()
  }, [uniforms, animated])

  return (
    <span
      aria-hidden
      data-slot="shader-surface"
      className={cn('relative isolate block overflow-hidden', className)}
      style={
        {
          '--shader-fallback': fallbackImage
            ? `url("${fallbackImage}")`
            : 'none',
        } as React.CSSProperties
      }
    >
      <canvas
        ref={canvasRef}
        data-renderer="fallback"
        className="absolute inset-0 size-full opacity-0"
      />
    </span>
  )
}
