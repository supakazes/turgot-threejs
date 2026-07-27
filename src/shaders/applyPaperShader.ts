import * as THREE from "three";
import { replaceMaterial } from "./replaceMaterial";
import { createDefaultPaperMaterial } from "./paper/paperMaterial";
import { register } from "./paper/registry";

// Calibrate the roof line density gradient to this mesh: map its world-Y range
// (eave..ridge) onto the climb 0..1 the roof shader expects, so "Density growth"
// works without manual tuning. Only touches roof materials, which carry
// uRoofBaseHeight/uRoofSpan.
function calibrateRoof(mesh: THREE.Mesh, material: THREE.ShaderMaterial) {
  if (!material.uniforms.uRoofBaseHeight) return;

  const bbox = new THREE.Box3().setFromObject(mesh);
  const span = Math.max(bbox.max.y - bbox.min.y, 1e-3);
  material.uniforms.uRoofBaseHeight.value = bbox.min.y;
  material.uniforms.uRoofSpan.value = span;
}

function convert(mesh: THREE.Mesh, material: THREE.Material, composed: boolean): THREE.Material {
  // Composed surfaces (facade windows/doors/hatching, roof) are only wanted on
  // detailed buildings. Everything else gets the bare paper look.
  const next = composed ? replaceMaterial(material) : createDefaultPaperMaterial();

  if (next instanceof THREE.ShaderMaterial) {
    calibrateRoof(mesh, next);
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
      obj.material = obj.material.map((m) => convert(obj, m, composed));
    } else {
      obj.material = convert(obj, obj.material, composed);
    }
  });
}
