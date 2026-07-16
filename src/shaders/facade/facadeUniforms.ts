import * as THREE from "three";

// Shared facade-appearance uniforms. Like paperUniforms, every facade material
// references these same objects, so a GUI change updates all facades at once.
export const facadeUniforms = {
  uWindowPitch: { value: 4.0 }, // horizontal spacing between windows (m)
  uFloorHeight: { value: 8 }, // vertical spacing between floors (m)
  uWindowSize: { value: new THREE.Vector2(0.55, 0.7) }, // fraction of a cell
  uGroundHeight: { value: 15.0 }, // height (m) reserved before row 1 starts
  uFloorCount: { value: 2 }, // number of window rows
  uInkColor: { value: new THREE.Color("#2b2117") },
};
