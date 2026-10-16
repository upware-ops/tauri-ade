#version 100
precision highp float;

/** @label Render resolution
 * @resolution
 */
uniform vec2 u_resolution;
/** @label Elapsed time
 * @time
 */
uniform float u_time;
/** @label Wave color
 * @color
 * @default #A7ADFF
 */
uniform vec3 u_signal;
/** @label Highlight color
 * @color
 * @default #9AF0DC
 */
uniform vec3 u_highlight;
/** @label Motion · zero freezes the field
 * @range 0, 1
 * @default 1
 */
uniform float u_motion;
/** @label Phase · seconds
 * @range 0, 12
 * @default 0
 */
uniform float u_phase;
/** @label Breath period · seconds
 * @range 4, 12
 * @default 5
 */
uniform float u_period;
/** @label Square spacing · pixels
 * @range 4, 10
 * @default 6
 */
uniform float u_pitch;

float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}

float band(float d, float width) {
    return exp(-d * d / (width * width));
}

void main() {
    float t = u_phase + u_time * u_motion;
    float phase = 6.2831853 * t / max(4.0, u_period);
    float inhale = sin(phase);
    vec2 pixel = gl_FragCoord.xy / u_resolution * vec2(1000.0, 700.0);
    vec2 p = pixel - vec2(500.0, 356.0);
    vec2 id = floor(p / u_pitch);
    vec2 cell = (id + 0.5) * u_pitch;
    vec2 local = p - cell;
    float a = atan(cell.y, cell.x);
    float r = length(cell);
    float seed = hash(id + 71.8);
    float warp = 10.0 * sin(a * 4.0 + 0.36 * sin(phase))
               + 4.5 * sin(a * 7.0 - 0.23 * t)
               + 2.5 * sin(a * 11.0 + 0.13 * t);
    float body = 199.0 + 20.0 * inhale + warp;
    float modulation = 0.66 + 0.22 * sin(a * 2.0 - t * 0.22)
                             + 0.12 * sin(a * 5.0 + t * 0.19);
    float primary = band(r - body, 12.0 + 5.5 * modulation);
    float inner = band(r - (body - 29.0 - 3.5 * cos(phase + a)), 7.0);
    float outer = band(r - (body + 34.0 + 4.0 * sin(phase - a)), 8.0);
    float fringe = band(r - (body + 51.0 + 3.0 * sin(a * 4.0 + phase)), 8.0);
    float cloud = band(r - body, 37.0) * 0.16;
    float traveling = 0.68 + 0.32 * sin(a * 2.0 - t * 0.43 + r * 0.014);
    float density = primary * 1.10 + inner * 0.71 + outer * 0.65 + fringe * 0.19 + cloud;
    density *= modulation;
    float active = smoothstep(seed - 0.12, seed + 0.10, density);
    float energy = clamp(density * 0.85 + primary * 0.22, 0.0, 1.0);
    float size = 0.65 + 1.50 * sqrt(energy) + 0.30 * seed;
    float distanceToSquare = max(abs(local.x), abs(local.y)) - size;
    float aa = 700.0 / u_resolution.y * 0.70;
    float square = 1.0 - smoothstep(-aa, aa, distanceToSquare);
    float quiet = smoothstep(139.0, 164.0, r);
    float edge = 1.0 - smoothstep(266.0, 292.0, r);
    float ink = square * active * (0.24 + 0.76 * energy) * traveling * quiet * edge;
    float tint = smoothstep(-0.8, 0.9, sin(a - t * 0.16 + 0.5)) * 0.85;
    vec3 emission = mix(u_signal, u_highlight, tint);
    float halo = band(length(p) - body, 19.0) * 0.026 * quiet * edge;
    float inkAlpha = clamp(ink, 0.0, 0.97);
    float alpha = inkAlpha + (1.0 - inkAlpha) * halo;
    gl_FragColor = vec4(emission * alpha, alpha);
}
