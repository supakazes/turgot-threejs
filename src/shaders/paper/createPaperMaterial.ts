import * as THREE from "three";

import vertexShader from "./paper.vert?raw";
import paper from "./paper.glsl?raw";
import distortion from "./distortion.glsl?raw";
import imperfections from "./imperfections.glsl?raw";
import paperBase from "./paperBase.frag?raw";
import { paperUniforms } from "./paperUniforms";
import { imperfectionUniforms } from "./imperfectionUniforms";
import { distortionUniforms } from "./distortionUniforms";

const PAPER_SCALE = 0.08;

// Builds a ShaderMaterial whose fragment shader is composed of these layers:
//   paper.glsl         -> paperColor(uv): the shared paper base texture
//   distortion.glsl    -> warpShape(): shared pre-shape coordinate warp
//   imperfections.glsl -> applyImperfections(): shared post-shape ink/grain pass
//   paperBase.frag     -> main(): paper-space uv + surfaceLayers() + imperfections
//   surfaceShader      -> surfaceLayers(base, uv): this surface's own layers
export function createPaperMaterial(surfaceShader: string): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,

    fragmentShader: [paper, distortion, imperfections, paperBase, surfaceShader].join("\n\n"),

    uniforms: {
      uPaperScale: {
        value: PAPER_SCALE,
      },

      uPaperMatrix: {
        value: new THREE.Matrix4(),
      },

      // Shared paper-appearance uniforms (same objects across all materials).
      ...paperUniforms,

      // Shared post-shape imperfection uniforms (same objects everywhere).
      ...imperfectionUniforms,

      // Shared pre-shape distortion uniforms (same objects everywhere).
      ...distortionUniforms,
    },
  });
}
