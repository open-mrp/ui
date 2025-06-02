precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;

// Boundary uniforms
uniform vec2 botLeft;
uniform vec2 botRight;
uniform vec2 topLeft;
uniform vec2 topRight;

// Convert from UV [0,1] space to NDC [-1,1] space
vec2 uvToNDC(vec2 uv) {
    return uv * 2.0 - 1.0;
}

// Linear interpolation between two points
float lerp(float a, float b, float t) {
    return a + t * (b - a);
}

// Returns positive if point p is on the left side of the line from a to b
float sideOfLine(vec2 p, vec2 a, vec2 b) {
    return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

// Check if a point is in the rendered area by checking if it's on the correct side of all boundary lines
bool isInRenderedArea(vec2 uv) {
    // Convert UV to NDC space to match the boundary coordinates
    vec2 p = uvToNDC(uv);
    
    // Check if point is on the correct side of all four lines
    // Note: The sign checks are arranged so that positive means "inside"
    float s1 = sideOfLine(p, botLeft, botRight);   // Bottom line
    float s2 = sideOfLine(p, botRight, topRight);  // Right line
    float s3 = sideOfLine(p, topRight, topLeft);   // Top line
    float s4 = sideOfLine(p, topLeft, botLeft);    // Left line
    
    // Point must be on the correct side of all lines to be inside
    return s1 >= 0.0 && s2 >= 0.0 && s3 <= 0.0 && s4 <= 0.0;
}

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;

    vec2 iuv = floor(st);
    vec2 fuv = fract(st);

    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
    // If current point is outside rendered area, set to zero
    if (!isInRenderedArea(vUv)) {
        gl_FragColor = vec4(0.0);
        return;
    }

#ifdef MANUAL_FILTERING
    vec2 velocity = bilerp(uVelocity, vUv, texelSize).xy;
    vec2 coord = vUv - dt * velocity * texelSize;
    
    // If advected position would be outside rendered area, reflect the velocity
    if (!isInRenderedArea(coord) || coord.x < 0.0 || coord.x > 1.0 || coord.y < 0.0 || coord.y > 1.0) {
        // Calculate the normal at the boundary for reflection
        float t = coord.x;
        float bottomY = lerp(0.0, 1.0, t);
        vec2 normal = normalize(vec2(1.0, bottomY));
        velocity = velocity - 2.0 * dot(velocity, normal) * normal;
        coord = vUv - dt * velocity * texelSize;
    }
    
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 coord = vUv - dt * velocity * texelSize;
    
    // If advected position would be outside rendered area, reflect the velocity
    if (!isInRenderedArea(coord) || coord.x < 0.0 || coord.x > 1.0 || coord.y < 0.0 || coord.y > 1.0) {
        // Calculate the normal at the boundary for reflection
        float t = coord.x;
        float bottomY = lerp(0.0, 1.0, t);
        vec2 normal = normalize(vec2(1.0, bottomY));
        velocity = velocity - 2.0 * dot(velocity, normal) * normal;
        coord = vUv - dt * velocity * texelSize;
    }
    
    vec4 result = texture2D(uSource, coord);
#endif
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
}