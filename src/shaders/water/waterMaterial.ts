import { createPaperMaterial } from "../paper/createPaperMaterial";
import { waterSurfaceLayersFn } from "./tsl/waterSurfaceLayers";

export function createWaterMaterial() {
  return createPaperMaterial(waterSurfaceLayersFn);
}
