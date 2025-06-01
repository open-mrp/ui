precision mediump float;
precision mediump sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;

#include "boundaryUtils.glsl"

void main () {
    float C = texture2D(uPressure, vUv).x;
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;

    // Handle boundaries
    if (vL.x < 0.0 || !isInRenderedArea(vL)) { L = C; }
    if (vR.x > 1.0 || !isInRenderedArea(vR)) { R = C; }
    if (vT.y > 1.0 || !isInRenderedArea(vT)) { T = C; }
    if (vB.y < 0.0 || !isInRenderedArea(vB)) { B = C; }

    // If current point is outside rendered area, set pressure to 0
    if (!isInRenderedArea(vUv)) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}