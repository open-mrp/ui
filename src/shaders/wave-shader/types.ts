import { ColorConfiguration } from "../colorConfigurations";

export interface WaveShaderProps {
  skew?: "full" | "bottom";
  skewDegree?: number;
  colorConfiguration?: ColorConfiguration;
  width?: number;
  minWidth?: number;
  maintainHeight?: number;
  height?: number;
  animate?: boolean;
  seed?: number;
  numWaves?: number;
  verticalScale?: number; // Scale factor for vertical space (0.0 to 1.0)
}
