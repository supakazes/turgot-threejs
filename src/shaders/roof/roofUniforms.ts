import * as THREE from "three";

// Horizontal roof lines (engraver's roof shading). Like the facade uniform
// groups, every roof material references these same objects, so a GUI change
// updates all roofs at once. Isolated so other roof types can reuse the layer.
export const roofLineUniforms = {
  uRoofLineDensity: { value: 1.2 }, // lines per meter at the eave (bottom)
  uRoofLineDensityGrowth: { value: 0.35 }, // extra lines/m at the ridge (denser going up)
  uRoofLineThicknessMin: { value: 0.1 }, // stroke thickness at the eave (0..1 of spacing)
  uRoofLineThicknessMax: { value: 0.5 }, // stroke thickness at the ridge (0..1 of spacing)
  uRoofLineShadowBoost: { value: 0.3 }, // extra thickness fraction when fully shadowed
  uRoofLineStrength: { value: 0.85 }, // overall opacity (0..1)
  uRoofLineInkColor: { value: new THREE.Color("#2b2117") },
};

// Climb mapping: world height is mapped to a 0 (eave) .. 1 (ridge) climb so the
// density gradient works in world-space meters. Unlike the other groups these
// are PER-MESH (each roof has a different elevation/height), so this is a factory
// of fresh objects, calibrated from each mesh's bounding box in applyPaperShader.
export function createRoofShapeUniforms() {
  return {
    uRoofBaseHeight: { value: 0.0 }, // world elevation of the eave (m)
    uRoofSpan: { value: 1.0 }, // roof height from eave to ridge (m)
  };
}
