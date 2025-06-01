precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uVelocity;

#include "boundaryUtils.glsl"

void main () {
    vec2 C = texture2D(uVelocity, vUv).xy;
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;

    // Handle boundaries
    if (vL.x < 0.0 || !isInRenderedArea(vL)) { L = -C.x; }
    if (vR.x > 1.0 || !isInRenderedArea(vR)) { R = -C.x; }
    if (vT.y > 1.0 || !isInRenderedArea(vT)) { T = -C.y; }
    if (vB.y < 0.0 || !isInRenderedArea(vB)) { B = -C.y; }

    // If current point is outside rendered area, set divergence to 0
    if (!isInRenderedArea(vUv)) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}