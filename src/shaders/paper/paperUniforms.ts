import * as THREE from "three";

// Shared paper-appearance uniforms. Every paper material references these same
// uniform objects, so changing a value (e.g. from lil-gui) updates the paper
// look across the whole scene at once.
export const paperUniforms = {
  uPaperBaseColor: { value: new THREE.Color(255 / 255, 253 / 255, 245 / 255) },
  uStain1Scale: { value: 2.74 },
  uStain1Strength: { value: 0.042 },

  uStain2Scale: { value: 10.0 },
  uStain2Strength: { value: 0.015 },

  uWarpStrength: { value: 0.4 },

  uGrainScale: { value: 500.0 },
  uGrainStrength: { value: 0.01 },

  uSpeckScale: { value: 120.0 },
  uSpeckDensity: { value: 0.35 },
  uSpeckSize: { value: 0.12 },
  uSpeckStrength: { value: 0.5 },
};
