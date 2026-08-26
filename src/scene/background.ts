import * as THREE from "three";
import { createPaperBgMaterial } from "../shaders/paper/createPaperBgMaterial";

export function createBackground(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = createPaperBgMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;

  function updateAspect() {
    material.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
  }
  window.addEventListener("resize", updateAspect);
  updateAspect();

  return mesh;
}
