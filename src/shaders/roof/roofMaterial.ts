import { uniform } from "three/tsl";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { createPaperMaterial } from "../paper/createPaperMaterial";
import { roofSurfaceLayersFn } from "./tsl/roofSurfaceLayers";

type RoofMaterial = MeshBasicNodeMaterial & {
  _uRoofBaseHeight: { value: number };
  _uRoofSpan: { value: number };
};

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
  }) as RoofMaterial;

  material._uRoofBaseHeight = uRoofBaseHeight;
  material._uRoofSpan = uRoofSpan;

  return material;
}
