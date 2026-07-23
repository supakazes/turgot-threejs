// Shared imperfection uniforms — applied by the post-shape pass in
// imperfections.glsl. Like paperUniforms, every paper material references these
// same objects, so a GUI change updates every facade/roof at once.
export const imperfectionUniforms = {
  // Ink breakup: dry/broken strokes.
  uInkBreakupScale: { value: 40.0 },
  uInkBreakupStrength: { value: 0.203 },

  // Ink transparency: paper bleeds through ink.
  uInkTransparency: { value: 0.08 },

  // Paper grain: fine tone variation over the whole surface.
  uPaperGrainScale: { value: 7.664 },
  uPaperGrainStrength: { value: 0.07 },
};
