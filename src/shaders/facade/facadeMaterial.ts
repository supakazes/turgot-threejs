import { createPaperMaterial } from "../paper/createPaperMaterial";
import { facadeSurfaceLayersFn } from "./tsl/facadeSurfaceLayers";

export function createFacadeMaterial() {
  return createPaperMaterial(facadeSurfaceLayersFn);
}
