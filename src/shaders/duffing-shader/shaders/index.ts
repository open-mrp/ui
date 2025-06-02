import { FragmentShader } from "../types";
import advectionShader from "./advectionShader.glsl";
import baseVertexShader from "./baseVertexShader.glsl";
import bloomBlurShader from "./bloomBlurShader.glsl";
import bloomFinalShader from "./bloomFinalShader.glsl";
import bloomPrefilterShader from "./bloomPrefilterShader.glsl";
import blurShader from "./blurShader.glsl";
import blurVertexShader from "./blurVertexShader.glsl";
import clearShader from "./clearShader.glsl";
import colorShader from "./colorShader.glsl";
import copyShader from "./copyShader.glsl";
import curlShader from "./curlShader.glsl";
import displayShader from "./displayShaderSource.glsl";
import divergenceShader from "./divergenceShader.glsl";
import gradientSubtractShader from "./gradientSubtractShader.glsl";
import pressureShader from "./pressureShader.glsl";
import splatShader from "./splatShader.glsl";
import sunraysMaskShader from "./sunraysMaskShader.glsl";
import sunraysShader from "./sunraysShader.glsl";
import vorticityShader from "./vorticityShader.glsl";

export async function getShaders(): Promise<Record<string, FragmentShader>> {
  return {
    advection: { shader: advectionShader, uniforms: {} },
    bloomBlur: { shader: bloomBlurShader, uniforms: {} },
    bloomFinal: { shader: bloomFinalShader, uniforms: {} },
    bloomPrefilter: { shader: bloomPrefilterShader, uniforms: {} },
    clear: { shader: clearShader, uniforms: {} },
    color: { shader: colorShader, uniforms: {} },
    copy: { shader: copyShader, uniforms: {} },
    curl: { shader: curlShader, uniforms: {} },
    divergence: { shader: divergenceShader, uniforms: {} },
    gradientSubtract: { shader: gradientSubtractShader, uniforms: {} },
    pressure: { shader: pressureShader, uniforms: {} },
    splat: { shader: splatShader, uniforms: {} },
    sunraysMask: { shader: sunraysMaskShader, uniforms: {} },
    sunrays: { shader: sunraysShader, uniforms: {} },
    vorticity: { shader: vorticityShader, uniforms: {} },
    display: { shader: displayShader, uniforms: {} },
  };
}

export {
  advectionShader,
  baseVertexShader,
  bloomBlurShader,
  bloomFinalShader,
  bloomPrefilterShader,
  blurShader,
  blurVertexShader,
  clearShader,
  colorShader,
  copyShader,
  curlShader,
  displayShader,
  divergenceShader,
  gradientSubtractShader,
  pressureShader,
  splatShader,
  sunraysMaskShader,
  sunraysShader,
  vorticityShader,
};
