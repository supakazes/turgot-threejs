import { uniform } from "three/tsl";

export const imperfectionUniforms = {
  uInkBreakupScale: uniform(40.0),
  uInkBreakupStrength: uniform(0.203),
  uInkTransparency: uniform(0.08),
  uPaperGrainScale: uniform(7.664),
  uPaperGrainStrength: uniform(0.07),
};
