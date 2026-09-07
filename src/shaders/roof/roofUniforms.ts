import * as THREE from "three/webgpu";
import { uniform } from "three/tsl";

export const roofLineUniforms = {
  uRoofLineDensity: uniform(0.162),
  uRoofLineDensityGrowth: uniform(0.262),
  uRoofLineThicknessMin: uniform(0.0),
  uRoofLineThicknessMax: uniform(0.398),
  uRoofLineShadowBoost: uniform(1.0),
  uRoofLineStrength: uniform(0.545),
  uRoofLineInkColor: uniform(new THREE.Color("#2b2117")),
};

