import * as THREE from "three/webgpu";
import { replaceMaterial } from "./replaceMaterial";
import { createDefaultPaperMaterial } from "./paper/paperMaterial";
import { register } from "./paper/registry";

function calibrateRoof(mesh: THREE.Mesh, material: any) {
  if (!material._uRoofBaseHeight) return;
  const bbox = new THREE.Box3().setFromObject(mesh);
  const span = Math.max(bbox.max.y - bbox.min.y, 1e-3);
  material._uRoofBaseHeight.value = bbox.min.y;
  material._uRoofSpan.value = span;
}

function convert(mesh: THREE.Mesh, material: THREE.Material, composed: boolean): THREE.Material {
  const next = composed ? replaceMaterial(material) : createDefaultPaperMaterial();
  calibrateRoof(mesh, next);
  register(next);
  return next;
}

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
