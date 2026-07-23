import * as THREE from "three";
import { replaceMaterial } from "./replaceMaterial";
import { createDefaultPaperMaterial } from "./paper/paperMaterial";
import { register } from "./paper/registry";

function convert(material: THREE.Material, composed: boolean): THREE.Material {
  // Composed surfaces (facade windows/doors/hatching, roof) are only wanted on
  // detailed buildings. Everything else gets the bare paper look.
  const next = composed ? replaceMaterial(material) : createDefaultPaperMaterial();

  if (next instanceof THREE.ShaderMaterial) {
    register(next);
  }

  return next;
}

// Walks an object tree and swaps every mesh material for its paper-based
// shader, registering the shader materials so their paper uniform updates
// each frame. Call this on any model that should get the paper aesthetic.
//
// composed: when true, surfaces are composed by material name (facade/roof
// layers); when false (default), every mesh gets plain paper only.
export function applyPaperShader(root: THREE.Object3D, composed = false) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((m) => convert(m, composed));
    } else {
      obj.material = convert(obj.material, composed);
    }
  });
}
