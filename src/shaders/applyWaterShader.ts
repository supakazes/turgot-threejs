import * as THREE from "three/webgpu";

import { register } from "./paper/registry";
import { createWaterMaterial } from "./water/waterMaterial";

function make() {
  const m = createWaterMaterial();
  register(m);
  return m;
}

export function applyWaterShader(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    obj.material = Array.isArray(obj.material) ? obj.material.map(make) : make();
  });
}
