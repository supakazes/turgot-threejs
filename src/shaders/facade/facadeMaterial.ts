import * as THREE from "three";

import paper from "../common/paper.glsl?raw";
import vertexShader from "./facade.vert?raw";
import fragmentShader from "./facade.frag?raw";

export function createFacadeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,

    fragmentShader: paper + "\n\n" + fragmentShader,

    uniforms: {
      uPaperScale: {
        value: 0.08,
      },

      uPaperMatrix: {
        value: new THREE.Matrix4(),
      },
    },
  });
}
