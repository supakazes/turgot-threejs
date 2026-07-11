import * as THREE from "three";

import vertexShader from "./paper.vert?raw";
import paper from "./paper.glsl?raw";
import paperBase from "./paperBase.frag?raw";
import { paperUniforms } from "./paperUniforms";

const PAPER_SCALE = 0.08;

// Builds a ShaderMaterial whose fragment shader is composed of three layers:
//   paper.glsl      -> paperColor(uv): the shared paper base texture
//   paperBase.frag  -> main(): paper-space uv + calls surfaceLayers()
//   surfaceShader   -> surfaceLayers(base, uv): this surface's own layers
export function createPaperMaterial(surfaceShader: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,

    fragmentShader: [paper, paperBase, surfaceShader].join("\n\n"),

    uniforms: {
      uPaperScale: {
        value: PAPER_SCALE,
      },

      uPaperMatrix: {
        value: new THREE.Matrix4(),
      },

      // Shared paper-appearance uniforms (same objects across all materials).
      ...paperUniforms,
    },
  });
}
