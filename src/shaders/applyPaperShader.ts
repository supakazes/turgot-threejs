import * as THREE from "three/webgpu";
import { replaceMaterial } from "./replaceMaterial";
import { createDefaultPaperMaterial } from "./paper/paperMaterial";
import { register } from "./paper/registry";

type RoofMaterial = THREE.Material & {
  _uRoofBaseHeight: { value: number };
  _uRoofSpan: { value: number };
};

function isRoofMaterial(m: THREE.Material): m is RoofMaterial {
  return "_uRoofBaseHeight" in m;
}

function calibrateRoof(mesh: THREE.Mesh, material: THREE.Material) {
  if (!isRoofMaterial(material)) return;
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
