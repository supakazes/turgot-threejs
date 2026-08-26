import * as THREE from "three";

import vertexShader from "./paperBg.vert?raw";
import paper from "./paper.glsl?raw";
import imperfections from "./imperfections.glsl?raw";
import paperBgBase from "./paperBgBase.frag?raw";
import { paperUniforms } from "./paperUniforms";
import { imperfectionUniforms } from "./imperfectionUniforms";
import { paperBgUniforms } from "./paperBgUniforms";

export function createPaperBgMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: [paper, imperfections, paperBgBase].join("\n\n"),
    uniforms: {
      ...paperBgUniforms,
      uAspect: { value: 1.0 },
      ...paperUniforms,
      ...imperfectionUniforms,
    },
    depthTest: false,
    depthWrite: false,
  });
}
