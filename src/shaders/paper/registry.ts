import * as THREE from "three";

// Every paper-based ShaderMaterial shares a uPaperMatrix uniform that keeps the
// paper texture locked to screen space (so the paper doesn't slide as you pan).
// The registry collects those materials and refreshes the uniform each frame.
const materials: THREE.ShaderMaterial[] = [];

const paperMatrix = new THREE.Matrix4();

export function register(material: THREE.ShaderMaterial) {
  materials.push(material);
}

export function update(camera: THREE.Camera) {
  paperMatrix.copy(camera.matrixWorldInverse);
  paperMatrix.setPosition(0, 0, 0);

  for (const material of materials) {
    material.uniforms.uPaperMatrix.value.copy(paperMatrix);
  }
}
