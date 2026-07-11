import * as THREE from "three";

// Shared paper-appearance uniforms. Every paper material references these same
// uniform objects, so changing a value (e.g. from lil-gui) updates the paper
// look across the whole scene at once.
export const paperUniforms = {
  uPaperBaseColor: { value: new THREE.Color(0.94, 0.925, 0.87) },
  uStain1Scale: { value: 2.0 },
  uStain1Strength: { value: 0.03 },
  uStain2Scale: { value: 10.0 },
  uStain2Strength: { value: 0.015 },
  uGrainScale: { value: 500.0 },
  uGrainStrength: { value: 0.01 },
  uSpeckScale: { value: 350.0 },
  uSpeckDensity: { value: 0.0025 },
  uSpeckStrength: { value: 0.15 },
};
