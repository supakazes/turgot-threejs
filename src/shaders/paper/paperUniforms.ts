import * as THREE from "three";

// Shared paper-appearance uniforms. Every paper material references these same
// uniform objects, so changing a value (e.g. from lil-gui) updates the paper
// look across the whole scene at once.
export const paperUniforms = {
  uPaperBaseColor: { value: new THREE.Color(255 / 255, 252 / 255, 235 / 255) },
  uStain1Scale: { value: 7.7 },
  uStain1Strength: { value: 0.1 },

  uStain2Scale: { value: 1.9 },
  uStain2Strength: { value: 0.04 },

  uWarpStrength: { value: 0.4 },

  uGrainScale: { value: 500.0 },
  uGrainStrength: { value: 0.01 },

  uSpeckScale: { value: 4.0 },
  uSpeckDensity: { value: 0.35 },
  uSpeckSize: { value: 0.12 },
  uSpeckStrength: { value: 0.5 },
};
