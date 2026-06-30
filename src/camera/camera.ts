import * as THREE from "three";

const frustumSize = 1000;

export { frustumSize };

export const camera = new THREE.OrthographicCamera(
  -frustumSize / 2,
  frustumSize / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  10000,
);

camera.position.set(0, 450, 500);
camera.zoom = 10;
