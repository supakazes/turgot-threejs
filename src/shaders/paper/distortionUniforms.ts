import { uniform } from "three/tsl";

export const distortionUniforms = {
  uDistortStrength: uniform(0.15),
  uDistortScale: uniform(3.0),
};
