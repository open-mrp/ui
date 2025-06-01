// Shared boundary utilities
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

// 2D cross product for winding number calculation
float cross2d(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
} 