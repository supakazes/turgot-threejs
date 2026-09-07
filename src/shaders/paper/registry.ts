import * as THREE from "three/webgpu";
import { uPaperMatrix } from "./paperUniforms";

const paperMatrix = new THREE.Matrix4();

// No-op: uPaperMatrix is a shared TSL uniform node, updated once for all materials.
export function register(_material: THREE.Material) {}

export function update(camera: THREE.Camera) {
  paperMatrix.copy(camera.matrixWorldInverse);
  paperMatrix.setPosition(0, 0, 0);
  uPaperMatrix.value.copy(paperMatrix);
}
