// Shared imperfection uniforms — applied by the post-shape pass in
// imperfections.glsl. Like paperUniforms, every paper material references these
// same objects, so a GUI change updates every facade/roof at once.
export const imperfectionUniforms = {
  // Ink breakup: dry/broken strokes.
  uInkBreakupScale: { value: 6.0 },
  uInkBreakupStrength: { value: 0.35 },

  // Ink transparency: paper bleeds through ink.
  uInkTransparency: { value: 0.15 },

  // Paper grain: fine tone variation over the whole surface.
  uPaperGrainScale: { value: 40.0 },
  uPaperGrainStrength: { value: 0.05 },
};
