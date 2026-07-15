import * as THREE from "three";

// Shared paper-appearance uniforms. Every paper material references these same
// uniform objects, so changing a value (e.g. from lil-gui) updates the paper
// look across the whole scene at once.
export const paperUniforms = {
  uPaperBaseColor: { value: new THREE.Color("#fffef6") },
  uStain1Scale: { value: 8.1635 },
  uStain1Strength: { value: 0.1401 },

  uStain2Scale: { value: 1.9 },
  uStain2Strength: { value: 0.04 },

  uWarpStrength: { value: 0.294 },

  // Big foxing specks
  uSpeck1Scale: { value: 2.94 },
  uSpeck1Density: { value: 0.565 },
  uSpeck1Size: { value: 0.08992 },
  uSpeck1Strength: { value: 0.553 },

  // Small foxing specks
  uSpeck2Scale: { value: 1.22 },
  uSpeck2Density: { value: 0.38 },
  uSpeck2Size: { value: 0.08042 },
  uSpeck2Strength: { value: 0.245 },
};
