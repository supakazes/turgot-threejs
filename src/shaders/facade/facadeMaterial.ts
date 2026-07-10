import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import surfaceShader from "./facade.frag?raw";

export function createFacadeMaterial(): THREE.ShaderMaterial {
  return createPaperMaterial(surfaceShader);
}
