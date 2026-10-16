precision highp float;

/** @resolution */
uniform vec2 u_resolution;

/** @label Grain preset · bind a named grain variable
 * @range 0, 3
 * @default 0
 */
uniform int u_preset;

float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 w = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), w.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), w.x), w.y);
}

void main() {
    int u_pattern = 0;
    float u_amount = 0.05;
    float u_size = 0.6;
    vec3 u_tint = vec3(0.7764705882352941, 0.7176470588235294, 0.6431372549019608);
    float u_tintMix = 0.0;
    int u_wave = 1;
    float u_waveAmount = 0.2;
    float u_wavelength = 120.0;
    float u_angle = 41.4;
    float u_seed = 0.0;
    float u_logicalWidth = 656.28;
    if (u_preset == 3) {
        u_amount = 0.0125;
    }
    if (u_preset == 1) {
        u_amount = 0.025;
    }
    if (u_preset == 2) {
        u_amount = 0.075;
        u_size = 0.9;
    }

    vec2 pixel = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    pixel *= (u_logicalWidth / 776.0);
    float angle = radians(u_angle);
    vec2 direction = vec2(cos(angle), sin(angle));
    vec2 rotated = vec2(dot(pixel, direction), dot(pixel, vec2(-direction.y, direction.x)));
    vec2 seed = vec2(u_seed * 17.13, u_seed * 9.71);
    vec2 p = pixel / u_size;
    vec2 cell = floor(p);
    float fine = hash(cell + seed) + hash(cell + seed + 81.7) - 1.0;
    float grain = fine;

    if (u_pattern == 1) {
        float clump = valueNoise(p * 0.65 + seed) * 2.0 - 1.0;
        grain = mix(fine, clump, 0.65);
    } else if (u_pattern == 2) {
        vec2 dots = p / 2.4;
        vec2 id = floor(dots);
        vec2 center = vec2(hash(id + seed + 4.2), hash(id + seed + 7.8));
        center = 0.25 + center * 0.5;
        float radius = mix(0.13, 0.29, hash(id + seed + 19.1));
        float dotMask = 1.0 - smoothstep(radius - 0.09, radius + 0.09, length(fract(dots) - center));
        float polarity = step(0.5, hash(id + seed + 31.4)) * 2.0 - 1.0;
        grain = dotMask * polarity;
    } else if (u_pattern == 3) {
        vec2 fiber = rotated / u_size;
        float threads = valueNoise(fiber * vec2(0.13, 1.3) + seed) * 2.0 - 1.0;
        grain = mix(fine, threads, 0.72);
    }

    float phase = dot(pixel, direction) / u_wavelength + u_seed * 0.013;
    float wave = 1.0;
    if (u_wave == 1) wave = 0.5 + 0.5 * sin(phase * 6.2831853);
    if (u_wave == 2) wave = 1.0 - abs(fract(phase) * 2.0 - 1.0);
    if (u_wave == 3) wave = smoothstep(-0.3, 0.3, sin(phase * 6.2831853));
    float envelope = mix(1.0, 0.45 + 0.55 * wave, u_waveAmount);

    vec3 darkGrain = mix(vec3(0.0), u_tint * 0.32, u_tintMix);
    vec3 lightGrain = mix(vec3(1.0), vec3(0.68) + u_tint * 0.32, u_tintMix);
    vec3 ink = grain < 0.0 ? darkGrain : lightGrain;
    float alpha = abs(grain) * u_amount * envelope;
    // Pen shader fills require premultiplied alpha.
    gl_FragColor = vec4(ink * alpha, alpha);
}
