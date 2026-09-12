import * as THREE from "three/webgpu";
import { uniform } from "three/tsl";

export const waterUniforms = {
  uWaterLineDensity: uniform(200.0),
  uWaterLineThickness: uniform(0.3),
  uWaterLineStrength: uniform(0.7),
  uWaterInkColor: uniform(new THREE.Color("#2a2a2a")),
  uWaterFlowSpeed: uniform(0.05),
  uWaterWaveFreq: uniform(3.0),
  uWaterWaveAmp: uniform(0.02),
  uWaterLineWobble: uniform(0.003),
  uWaterThicknessVar: uniform(0.2),
  uWaterNoiseScale: uniform(4.0),
  uWaterNoiseStrength: uniform(0.005),
};
