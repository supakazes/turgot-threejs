import * as THREE from "three";
import { replaceMaterial } from "./replaceMaterial";
import { register } from "./paper/registry";

function convert(material: THREE.Material): THREE.Material {
  const next = replaceMaterial(material);

  if (next instanceof THREE.ShaderMaterial) {
    register(next);
  }

  return next;
}

// Walks an object tree and swaps every mesh material for its paper-based
// shader, registering the shader materials so their paper uniform updates
// each frame. Call this on any model that should get the paper aesthetic.
export function applyPaperShader(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map(convert);
    } else {
      obj.material = convert(obj.material);
    }
  });
}
