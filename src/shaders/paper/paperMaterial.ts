import * as THREE from "three";

import { createPaperMaterial } from "./createPaperMaterial";

// The bare paper base with no extra surface layers.
// Used as the default for any mesh whose surface isn't specialised yet.
const passThrough = /* glsl */ `
vec3 surfaceLayers(vec3 base, vec2 uv, vec2 wallUV, vec2 wallSize, vec2 metric, bool hasWallData)
{
    return base;
}
`;

export function createDefaultPaperMaterial(): THREE.ShaderMaterial {
  return createPaperMaterial(passThrough);
}
