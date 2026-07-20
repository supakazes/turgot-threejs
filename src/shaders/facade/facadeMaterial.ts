import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import { facadeUniforms, placeDauphineDoorUniforms } from "./facadeUniforms";
import sdf from "./sdf.glsl?raw";
import placeDauphineDoor from "./placeDauphineDoor.glsl?raw";
import facade from "./facade.frag?raw";

// Prepend shared SDF helpers + the door layer so facade.frag can call them.
const surfaceShader = [sdf, placeDauphineDoor, facade].join("\n\n");

export function createFacadeMaterial(): THREE.ShaderMaterial {
  const material = createPaperMaterial(surfaceShader);

  // Facade-specific window + door uniforms (shared objects, live-editable via GUI).
  Object.assign(material.uniforms, facadeUniforms, placeDauphineDoorUniforms);

  return material;
}
