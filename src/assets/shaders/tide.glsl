precision highp float;
/** @resolution */
uniform vec2 u_resolution;
/** @time */
uniform float u_time;
/** @label Play
 * @range 0, 1
 * @default 1
 */
uniform int u_play;
/** @label Speed multiplier
 * @range 0.25, 3
 * @default 1
 */
uniform float u_speed;
/** @label Phase
 * @range 0, 1
 * @default 0
 */
uniform float u_phase;
/** @label Interpolation
 * @range 0, 1
 * @default 0
 */
uniform float u_blend;
/** @label Reverse
 * @range 0, 1
 * @default 0
 */
uniform int u_reverse;
/** @label Ink color
 * @color
 * @default #A7A7A7
 */
uniform vec3 u_ink;
/** @label Opacity
 * @range 0, 1
 * @default 1
 */
uniform float u_opacity;
/** @label Resting cells
 * @range 0, 0.25
 * @default 0
 */
uniform float u_rest;

vec3 row0(float frame) {
  if (frame < 0.5) return vec3(0.247059, 0.200000, 0.200000);
  if (frame < 1.5) return vec3(0.505882, 0.200000, 0.200000);
  if (frame < 2.5) return vec3(0.588235, 0.200000, 0.200000);
  if (frame < 3.5) return vec3(0.643137, 0.250980, 0.200000);
  if (frame < 4.5) return vec3(0.650980, 0.529412, 0.200000);
  if (frame < 5.5) return vec3(0.643137, 0.631373, 0.200000);
  if (frame < 6.5) return vec3(0.592157, 0.623529, 0.470588);
  if (frame < 7.5) return vec3(0.458824, 0.647059, 0.603922);
  if (frame < 8.5) return vec3(0.188235, 0.627451, 0.650980);
  if (frame < 9.5) return vec3(0.188235, 0.537255, 0.650980);
  if (frame < 10.5) return vec3(0.188235, 0.258824, 0.639216);
  if (frame < 11.5) return vec3(0.188235, 0.207843, 0.525490);
  if (frame < 12.5) return vec3(0.188235, 0.207843, 0.266667);
  if (frame < 13.5) return vec3(0.188235, 0.207843, 0.200000);
  if (frame < 14.5) return vec3(0.188235, 0.207843, 0.200000);
  if (frame < 15.5) return vec3(0.188235, 0.207843, 0.200000);
  return vec3(0.2);
}
vec3 row1(float frame) {
  if (frame < 0.5) return vec3(0.211765, 0.200000, 0.200000);
  if (frame < 1.5) return vec3(0.211765, 0.200000, 0.200000);
  if (frame < 2.5) return vec3(0.400000, 0.200000, 0.200000);
  if (frame < 3.5) return vec3(0.592157, 0.200000, 0.200000);
  if (frame < 4.5) return vec3(0.635294, 0.349020, 0.200000);
  if (frame < 5.5) return vec3(0.647059, 0.584314, 0.200000);
  if (frame < 6.5) return vec3(0.635294, 0.635294, 0.243137);
  if (frame < 7.5) return vec3(0.596078, 0.643137, 0.549020);
  if (frame < 8.5) return vec3(0.423529, 0.647059, 0.619608);
  if (frame < 9.5) return vec3(0.200000, 0.607843, 0.643137);
  if (frame < 10.5) return vec3(0.200000, 0.486275, 0.647059);
  if (frame < 11.5) return vec3(0.200000, 0.200000, 0.619608);
  if (frame < 12.5) return vec3(0.200000, 0.200000, 0.521569);
  if (frame < 13.5) return vec3(0.200000, 0.200000, 0.250980);
  if (frame < 14.5) return vec3(0.200000, 0.200000, 0.200000);
  if (frame < 15.5) return vec3(0.200000, 0.200000, 0.200000);
  return vec3(0.2);
}
vec3 row2(float frame) {
  if (frame < 0.5) return vec3(0.200000, 0.200000, 0.200000);
  if (frame < 1.5) return vec3(0.200000, 0.200000, 0.200000);
  if (frame < 2.5) return vec3(0.200000, 0.200000, 0.200000);
  if (frame < 3.5) return vec3(0.482353, 0.200000, 0.200000);
  if (frame < 4.5) return vec3(0.607843, 0.200000, 0.200000);
  if (frame < 5.5) return vec3(0.650980, 0.427451, 0.203922);
  if (frame < 6.5) return vec3(0.647059, 0.596078, 0.200000);
  if (frame < 7.5) return vec3(0.639216, 0.635294, 0.333333);
  if (frame < 8.5) return vec3(0.564706, 0.650980, 0.537255);
  if (frame < 9.5) return vec3(0.337255, 0.639216, 0.623529);
  if (frame < 10.5) return vec3(0.200000, 0.600000, 0.654902);
  if (frame < 11.5) return vec3(0.200000, 0.349020, 0.654902);
  if (frame < 12.5) return vec3(0.200000, 0.200000, 0.631373);
  if (frame < 13.5) return vec3(0.200000, 0.200000, 0.556863);
  if (frame < 14.5) return vec3(0.200000, 0.200000, 0.407843);
  if (frame < 15.5) return vec3(0.200000, 0.200000, 0.200000);
  return vec3(0.2);
}
vec3 sampleRow(int r, float frame) {
  if (frame < 0.0 || frame > 15.0) return vec3(0.2);
  float f = floor(frame);
  vec3 a = r == 0 ? row0(f) : r == 1 ? row1(f) : row2(f);
  vec3 b = r == 0 ? row0(f + 1.0) : r == 1 ? row1(f + 1.0) : row2(f + 1.0);
  return mix(a, b, fract(frame));
}
vec3 overlappingRow(int r, float frame) {
  vec3 base = vec3(0.2);
  vec3 current = sampleRow(r, frame);
  vec3 entering = base + max(sampleRow(r, frame + 1.5) - base, vec3(0.0)) * 0.8;
  vec3 leaving = base + max(sampleRow(r, frame - 1.0) - base, vec3(0.0)) * 0.7;
  return max(current, max(entering, leaving));
}

void main() {
  vec2 pixel = floor(vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y));
  float scale = min(u_resolution.x, u_resolution.y) / 15.0;
  float side = max(1.0, floor(2.0 * scale + 0.5));
  float gap = max(1.0, floor(2.0 * scale + 0.5));
  float extent = 3.0 * side + 2.0 * gap;
  vec2 origin = floor((u_resolution - vec2(extent)) * 0.5);
  float phase = fract(float(u_play) * u_time * u_speed / 1.12 + u_phase);
  if (u_reverse == 1) phase = fract(-phase);
  float t = phase * 16.0;
  float f = floor(t);
  float next = mod(f + 1.0, 16.0);
  float blend = fract(t) * u_blend;
  float alpha = 0.0;
  for (int r = 0; r < 3; r++) {
    vec3 value = mix(overlappingRow(r, f), overlappingRow(r, next), blend);
    for (int c = 0; c < 3; c++) {
      vec2 corner = origin + vec2(float(c), float(r)) * (side + gap);
      vec2 local = pixel - corner;
      vec2 inside = step(vec2(0.0), local) * (vec2(1.0) - step(vec2(side), local));
      float square = inside.x * inside.y;
      float gray = c == 0 ? value.x : c == 1 ? value.y : value.z;
      float opacity = clamp((gray - 0.212) / (0.655 - 0.212), 0.0, 1.0);
      alpha = max(alpha, square * mix(u_rest, 1.0, opacity) * u_opacity);
    }
  }
  gl_FragColor = vec4(u_ink * alpha, alpha);
}
