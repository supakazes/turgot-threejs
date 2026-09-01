import { Color } from "three";

// Shared uniforms for all water materials.
// Every createWaterMaterial() instance references these same objects,
// so GUI edits and uTime updates propagate to all water surfaces at once.
export const waterUniforms = {
  uWaterLineDensity:    { value: 500.0 },
  uWaterLineThickness:  { value: 0.25 },
  uWaterFlowSpeed:      { value: 0.001 },
  uWaterCurlStrength:   { value: 0.4 },
  uWaterCurlScale:      { value: 0.12 },
  uWaterMergeStrength:  { value: 0.5 },
  uWaterBankFade:       { value: 0.0 },
  uWaterBankCurve:      { value: 0.4 },
  uWaterInkColor:       { value: new Color(0x2a2318) },
  uTime:                { value: 0.0 },
};
