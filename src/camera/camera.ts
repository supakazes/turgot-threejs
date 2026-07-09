import * as THREE from "three";

export const frustumSize = 1000;

export const camera = new THREE.OrthographicCamera(
  -frustumSize / 2,
  frustumSize / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  10000,
);

// Camera angle is a special calculation because of the usage of MapControls
// We want 48° (same as the value found in Blender)
const x = 450;
const z = x / Math.tan(THREE.MathUtils.degToRad(48)); // ≈ 405

// camera init position and zoom
camera.position.set(0, x, z);
camera.zoom = 2;
