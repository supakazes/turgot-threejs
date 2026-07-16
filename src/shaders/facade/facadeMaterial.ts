import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import { facadeUniforms } from "./facadeUniforms";
import surfaceShader from "./facade.frag?raw";

export function createFacadeMaterial(): THREE.ShaderMaterial {
  const material = createPaperMaterial(surfaceShader);

  // Facade-specific window uniforms (shared objects, live-editable via GUI).
  Object.assign(material.uniforms, facadeUniforms);

  return material;
}
