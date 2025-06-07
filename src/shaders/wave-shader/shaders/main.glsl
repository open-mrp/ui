precision highp float;

uniform float u_time; // Time in seconds
uniform float u_h;
uniform float u_w;
uniform sampler2D u_gradient;

const float PI = 3.14159;

// Noise utility functions
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

// Simplex noise functions
float simplex_noise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  float n_ = 0.142857142857; // 1.0/7.0
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float simplex_noise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  // First corner
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  // Gradients
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  // Compute final noise value at P
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Various utility functions
float smoothstep(float t) {
  return t * t * t * (t * (6.0 * t - 15.0) + 10.0);
}

float lerp(float a, float b, float t) {
  return a * (1.0 - t) + b * t;
}

float ease_in(float x) {
  return 1.0 - cos((x * PI) * 0.5);
}

float wave_alpha_part(float dist, float blur_fac, float t) {
  float exp = mix(0.9, 1.2, t);
  float v = pow(blur_fac, exp);
  v = ease_in(v);
  v = smoothstep(v);
  v = clamp(v, 0.008, 1.0);
  v *= 345.0;

  // Create the main line with a sharp falloff
  float line_width = 4.0;
  float alpha = 1.0 - smoothstep(0.0, line_width, abs(dist));
  alpha = pow(alpha, 2.0);

  // Add a softer glow effect
  float glow_width = 20.0; // Increased from 12.0 to 20.0 for a bigger glow
  float glow_alpha = 1.0 - smoothstep(0.0, glow_width, abs(dist));
  glow_alpha = pow(glow_alpha, 1.3); // Slightly softer falloff (1.5 -> 1.3)
  glow_alpha *= 0.25; // Slightly reduced intensity to balance the larger size

  // Combine the main line with the glow
  return max(alpha, glow_alpha);
}

float get_x() {
  return 900.0 + gl_FragCoord.x - u_w / 2.0;
}

float background_noise(float offset) {
  const float S = 0.064;
  const float L = 0.00085;
  const float L1 = 1.5, L2 = 0.9, L3 = 0.6;
  const float LY1 = 1.00, LY2 = 0.85, LY3 = 0.70;
  const float F = 0.04;
  const float Y_SCALE = 1.0 / 0.27;

  float x = get_x() * L;
  float y = gl_FragCoord.y * L * Y_SCALE;
  float time = u_time + offset;
  float x_shift = time * F;
  float sum = 0.5;
  sum += simplex_noise(vec3(x * L1 + x_shift * 1.1, y * L1 * LY1, time * S)) * 0.30;
  sum += simplex_noise(vec3(x * L2 + -x_shift * 0.6, y * L2 * LY2, time * S)) * 0.25;
  sum += simplex_noise(vec3(x * L3 + x_shift * 0.8, y * L3 * LY3, time * S)) * 0.20;
  return sum;
}

float wave_y_noise(float offset) {
  const float L = 0.000845;
  const float S = 0.01875;
  const float F = 0.0065;

  float time = u_time * 2.0 + offset;
  float x = get_x() * 0.000845;
  float y = time * S;
  float x_shift = time * F;

  float sum = 0.0;
  sum += simplex_noise(vec2(x * 1.30 + x_shift, y * 0.54)) * 0.85;
  sum += simplex_noise(vec2(x * 1.00 + x_shift, y * 0.68)) * 1.15;
  sum += simplex_noise(vec2(x * 0.70 + x_shift, y * 0.59)) * 0.60;
  sum += simplex_noise(vec2(x * 0.40 + x_shift, y * 0.48)) * 0.40;
  return sum;
}

float calc_blur_bias() {
  const float S = 0.261;
  float bias_t = (sin(u_time * S) + 1.0) * 0.5;
  return lerp(-0.17, -0.04, bias_t);
}

float calc_blur(float offset) {
  const float L = 0.0011;
  const float S = 0.07;
  const float F = 0.03;

  float time = u_time + offset;

  float x = get_x() * L;
  float blur_fac = calc_blur_bias();
  blur_fac += simplex_noise(vec2(x * 0.60 + time * F * 1.0, time * S * 0.7)) * 0.5;
  blur_fac += simplex_noise(vec2(x * 1.30 + time * F * -0.8, time * S * 1.0)) * 0.4;
  blur_fac = (blur_fac + 1.0) * 0.5;
  blur_fac = clamp(blur_fac, 0.0, 1.0);
  return blur_fac;
}

float wave_alpha(float Y, float wave_height, float offset) {
  float wave_y = Y + wave_y_noise(offset) * wave_height;
  float dist = wave_y - gl_FragCoord.y;
  float blur_fac = calc_blur(offset);

  const float PART = 1.0 / 7.0;
  float sum = 0.0;
  for(int i = 0; i < 7; i++) {
    float t = 7 == 1 ? 0.5 : PART * float(i);
    sum += wave_alpha_part(dist, blur_fac, t) * PART;
  }

  float min_opacity = 0.1;
  float max_opacity = 1.0;

  // Add spatial variation to opacity
  float x_pos = get_x() * 0.001; // Scale factor for x position
  float time = u_time * 0.5;
  float opacity = min_opacity + max_opacity * (sin(time + x_pos + offset * 0.01) + max_opacity) * 0.5;
  opacity = clamp(opacity, min_opacity, max_opacity);

  return sum * opacity;
}

vec3 calc_color(float lightness) {
  lightness = clamp(lightness, 0.0, 1.0);
  return vec3(texture2D(u_gradient, vec2(lightness, 0.5)));
}

void main() {
  // Start with a dark background
  float lightness = 0.0;

  // Process waves using a loop
  const int NUM_WAVES = 6;
  for(int i = 0; i < NUM_WAVES; i++) {
    float t = float(i) / float(NUM_WAVES - 1);

    // Calculate wave parameters
    float wave_y = mix(0.05, 0.85, t) * u_h;
    float wave_height = mix(0.09, 0.13, sin(t * PI * 0.5)) * u_h;
    float wave_speed = mix(0.7, 1.4, sin(t * PI * 0.375));
    float wave_offset = (112.5 + float(i) * 112.5) * mix(30.0, 48.0, sin(t * PI * 0.5));

    // Process wave
    float wave_lightness = 0.9;
    float wave_alpha_value = wave_alpha(wave_y, wave_height, wave_offset);
    lightness = lerp(lightness, wave_lightness, wave_alpha_value);
  }

  // Blend wave color with a #060815 background
  vec3 backgroundColor = vec3(0.0235, 0.0314, 0.0824); // #060815
  vec3 waveColor = calc_color(lightness);
  vec3 finalColor = mix(backgroundColor, waveColor, lightness);
  gl_FragColor = vec4(finalColor, 1.0);
}