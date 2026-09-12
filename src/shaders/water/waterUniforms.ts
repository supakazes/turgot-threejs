import * as THREE from "three/webgpu";
import { uniform } from "three/tsl";

export const waterUniforms = {
  uWaterLineDensity: uniform(400.0),
  uWaterLineThickness: uniform(0.23),
  uWaterLineStrength: uniform(0.74),
  uWaterInkColor: uniform(new THREE.Color("#2a2a2a")),
  uWaterFlowSpeed: uniform(0.11),
  uWaterWaveFreq: uniform(6.24),
  uWaterWaveAmp: uniform(0.03),
  uWaterLineWobble: uniform(0.05),
  uWaterThicknessVar: uniform(0.18),
  uWaterNoiseScale: uniform(13.83),
  uWaterNoiseStrength: uniform(0.0),
};
