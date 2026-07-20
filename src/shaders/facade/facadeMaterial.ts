import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import {
  facadeUniforms,
  placeDauphineDoorUniforms,
  floorLineUniforms,
} from "./facadeUniforms";
import sdf from "./sdf.glsl?raw";
import placeDauphineDoor from "./placeDauphineDoor.glsl?raw";
import floorLines from "./floorLines.glsl?raw";
import facade from "./facade.frag?raw";

// Prepend shared SDF helpers + the door + floor-line layers so facade.frag can
// call them.
const surfaceShader = [sdf, placeDauphineDoor, floorLines, facade].join("\n\n");

export function createFacadeMaterial(): THREE.ShaderMaterial {
  const material = createPaperMaterial(surfaceShader);

  // Facade-specific window + door + floor-line uniforms (shared objects,
  // live-editable via GUI).
  Object.assign(
    material.uniforms,
    facadeUniforms,
    placeDauphineDoorUniforms,
    floorLineUniforms,
  );

  return material;
}
