// Shared distortion uniforms — used by warpShape() in distortion.glsl. Like
// paperUniforms, every paper material references these same objects, so a GUI
// change warps every facade/roof at once.
export const distortionUniforms = {
  uDistortStrength: { value: 0.15 }, // displacement amplitude (m); 0 = perfect edges
  uDistortScale: { value: 3.0 }, // wobble frequency (higher = tighter)
};
