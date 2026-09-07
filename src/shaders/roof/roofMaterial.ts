import { uniform } from "three/tsl";
import { createPaperMaterial } from "../paper/createPaperMaterial";
import { roofSurfaceLayersFn } from "./tsl/roofSurfaceLayers";

export function createRoofMaterial() {
  const uRoofBaseHeight = uniform(0.0);
  const uRoofSpan = uniform(1.0);

  const material = createPaperMaterial((base, uvPaper, wallUV, wallSize, metric, hasWallData, worldNormal) => {
    return roofSurfaceLayersFn(
      base,
      uvPaper,
      wallUV,
      wallSize,
      metric,
      hasWallData,
      worldNormal,
      uRoofBaseHeight,
      uRoofSpan,
    );
  });

  (material as any)._uRoofBaseHeight = uRoofBaseHeight;
  (material as any)._uRoofSpan = uRoofSpan;

  return material;
}
