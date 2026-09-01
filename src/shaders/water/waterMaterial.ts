import * as THREE from "three";

import { createPaperMaterial } from "../paper/createPaperMaterial";
import { waterUniforms } from "./waterUniforms";
import waterLines from "./waterLines.glsl?raw";
import water from "./water.frag?raw";

// waterLines.glsl is prepended so water.frag can call drawWaterLines().
const surfaceShader = [waterLines, water].join("\n\n");

export function createWaterMaterial(): THREE.ShaderMaterial {
  const material = createPaperMaterial(surfaceShader);
  Object.assign(material.uniforms, waterUniforms);
  return material;
}
