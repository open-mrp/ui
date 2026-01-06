precision highp float;

uniform float u_time; // Time in seconds
uniform float u_h;
uniform float u_w;
uniform sampler2D u_gradient;
uniform int u_num_waves; // Number of waves to render
uniform float u_pixel_ratio; // Device pixel ratio for sharp rendering
uniform vec3 u_background_color; // Background color (RGB normalized 0-1)

const float PI = 3.14159;
const int MAX_WAVES = 20; // Maximum possible waves

float get_x() {
  return 900.0 + gl_FragCoord.x - u_w / 2.0;
}

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
float smoothstep_quintic(float t) {
  return t * t * t * (t * (6.0 * t - 15.0) + 10.0);
}

float lerp(float a, float b, float t) {
  return a * (1.0 - t) + b * t;
}

// Blur constants
const float BLUR_AMOUNT = 120.0;      // Maximum blur in pixels
const float BLUR_MIN = 1.0;          // Minimum blur (sharpest edge)
const float BLUR_EXPONENT = 3.5;     // Exponent to bias toward sharpness
const float BLUR_FREQUENCY = 0.0008; // Spatial frequency of blur variation
const float BLUR_SPEED = 0.15;      // How fast blur moves along waves

// Calculate variable blur amount using noise
// This creates areas of sharpness and blur that flow along the wave
float calc_blur(float x_pos, float offset) {
  float time = u_time + offset * 0.01;
  
  // Use noise to determine blur amount at this position
  float noise = simplex_noise(vec2(
    x_pos * BLUR_FREQUENCY + time * BLUR_SPEED,
    time * BLUR_SPEED * 0.5
  ));
  
  // Normalize from [-1, 1] to [0, 1]
  float t = (noise + 1.0) / 2.0;
  
  // Apply exponent to bias toward sharpness
  // This makes the wave mostly sharp with occasional blurry areas
  t = pow(t, BLUR_EXPONENT);
  
  // Add oscillating global blur bias for periods of overall sharpness/blur
  // This creates a "breathing" effect across the entire canvas
  float blur_bias = 0.5 + 0.3 * sin(u_time * 0.08 + offset * 0.005);
  t = mix(t, t * blur_bias, 0.4);
  
  // Mix between minimum blur (sharp) and maximum blur
  float blur = mix(BLUR_MIN, BLUR_AMOUNT, t);
  
  return blur;
}

float wave_y_noise(float offset) {
  const float L = 0.000845;
  const float S = 0.01875;
  const float F = 0.0065;

  float time = u_time * 1.2 + offset; // Slowed down from 2.0 to 1.2
  float x = get_x() * L;
  float y = time * S;
  float x_shift = time * F;

  // Reduced to 2 octaves instead of 3
  float sum = 0.0;
  sum += simplex_noise(vec2(x * 1.30 + x_shift, y * 0.54)) * 0.90;
  // sum += simplex_noise(vec2(x * 1.30 + x_shift, y * 0.54)) * 0.80;
  sum += simplex_noise(vec2(x * 0.55 + x_shift, y * 0.59)) * 0.55;
  return sum;
}

// Area fill alpha calculation - fills below the wave with variable blur effect
// Based on Alex Harri's gradient technique: https://alexharri.com/blog/webgl-gradients
float wave_area_alpha(float wave_y_position, float wave_height, float offset, float x_cached) {
  // Calculate the actual wave y position with noise applied
  float wave_y = wave_y_position + wave_y_noise(offset) * wave_height;
  float pixel_y = gl_FragCoord.y;
  
  // Calculate signed distance from wave line (negative = below wave, positive = above)
  float dist = pixel_y - wave_y;
  
  // Calculate variable blur at this position
  float blur = calc_blur(x_cached, offset);
  
  // Calculate alpha based on distance and blur
  // This creates the smooth, variable blur effect along the wave
  // When blur is small, the edge is sharp; when blur is large, the edge is soft
  float alpha = clamp(0.5 - dist / blur, 0.0, 1.0);
  
  // Apply quintic smoothstep for even smoother transitions
  alpha = smoothstep_quintic(alpha);
  
  // Calculate fade based on distance below wave for gradient fill
  // Fade from 1.0 at wave line to 0.0 at bottom of canvas
  float distance_below = max(wave_y - pixel_y, 0.0);
  float fade_distance = max(wave_y, 1.0); // Distance from wave to bottom (y=0)
  float fill_fade = 1.0 - (distance_below / fade_distance);
  
  // Apply a power curve for more dramatic gradient (brighter near wave, faster fade)
  fill_fade = pow(clamp(fill_fade, 0.0, 1.0), 1.2);
  
  // Combine edge blur with fill fade
  alpha *= fill_fade;
  
  // Add subtle time-based variation for organic feel
  float x_pos = x_cached * 0.001;
  float time_variation = 0.88 + 0.12 * sin(u_time * 0.15 + x_pos + offset * 0.01);
  alpha *= time_variation;
  
  return clamp(alpha, 0.0, 1.0);
}

vec3 calc_color(float lightness) {
  lightness = clamp(lightness, 0.0, 1.0);
  return vec3(texture2D(u_gradient, vec2(lightness, 0.5)));
}

void main() {
  // Pre-compute ALL invariant values before the loop
  float y_coord = gl_FragCoord.y;
  float x_cached = get_x(); // Cache this expensive calculation
  float margin = u_h * 0.02;              // 2 % margin from top and bottom
  float available_height = u_h - (2.0 * margin);
  float spacing = available_height / max(float(u_num_waves - 1), 1.0);
  float wave_height = u_h * 0.11;              // 11 % of canvas height
  float inv_num_waves = 1.0 / max(float(u_num_waves - 1), 1.0); // Pre-compute division

  // Start with a dark background - accumulate lightness like original strands
  float lightness = 0.0;

  // Process waves using a loop (same order as original)
  for(int i = 0; i < MAX_WAVES; i++) {
    if(i >= u_num_waves)
      break; // Stop after rendering requested number of waves

    // Compute the y-position of this wave
    float wave_y = margin + (float(i) * spacing);

    // Calculate t for parameterisation along 0-1
    float t = float(i) * inv_num_waves;

    // Pre-compute the offset for this wave - simplified calculation
    float wave_offset = 112.5 * (1.0 + float(i)) * (39.0 + 9.0 * sin(t * PI * 0.5));

    // Calculate area fill alpha with gradient fade
    float area_alpha = wave_area_alpha(wave_y, wave_height, wave_offset, x_cached);

    // Reduce opacity for every other wave - same as original
    float opacity_multiplier = mix(1.0, 0.5, mod(float(i), 2.0));
    area_alpha *= opacity_multiplier;

    // Scale down the alpha contribution so lightness accumulates more gradually
    // This prevents saturation and uses the full gradient spectrum
    float scaled_alpha = area_alpha * 0.4;
    
    // Accumulate lightness - more overlap = higher lightness = further along gradient
    lightness += scaled_alpha;
  }

  // Clamp lightness to valid range
  lightness = clamp(lightness, 0.0, 1.0);

  // Blend wave color with background - same as original
  vec3 waveColor = calc_color(lightness);
  vec3 finalColor = mix(u_background_color, waveColor, lightness);

  gl_FragColor = vec4(finalColor, 1.0);
}
