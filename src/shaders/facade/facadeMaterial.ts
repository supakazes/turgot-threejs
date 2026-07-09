import * as THREE from "three";

import vertexShader from "./facade.vert?raw";
import fragmentShader from "./facade.frag?raw";

export function createFacadeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
  });
}
