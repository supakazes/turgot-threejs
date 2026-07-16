import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import surfaceShader from "./roof.frag?raw";

export function createRoofMaterial(): THREE.ShaderMaterial {
  return createPaperMaterial(surfaceShader);
}
