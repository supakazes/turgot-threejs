import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import { lightUniforms } from "../facade/facadeUniforms";
import { roofLineUniforms, createRoofShapeUniforms } from "./roofUniforms";
import roofLines from "./roofLines.glsl?raw";
import roof from "./roof.frag?raw";

// Prepend the horizontal-line layer so roof.frag can call it.
const surfaceShader = [roofLines, roof].join("\n\n");

export function createRoofMaterial(): THREE.ShaderMaterial {
  const material = createPaperMaterial(surfaceShader);

  // Roof-specific line uniforms, the shared fake-light direction (same object the
  // facade hatching uses), and PER-MESH shape uniforms calibrated from the mesh
  // bounding box in applyPaperShader (fresh objects, not shared). Imperfections
  // are inherited from createPaperMaterial's shared imperfectionUniforms, so the
  // "Imperfections" GUI folder drives facade AND roof together.
  Object.assign(material.uniforms, roofLineUniforms, createRoofShapeUniforms(), lightUniforms);

  return material;
}
