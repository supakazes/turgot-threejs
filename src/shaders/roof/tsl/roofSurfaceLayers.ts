import { Fn, float, select, clamp, dot, normalize, max } from "three/tsl";
import { lightUniforms } from "../../facade/facadeUniforms";
import { warpShapeFn } from "../../paper/tsl/distortionFunctions";
import { roofHorizontalLinesFn } from "./roofLineFunctions";

export const roofSurfaceLayersFn = Fn(
  ([base, _uvPaper, wallUV, wallSize, metric, hasWallData, worldNormal, uRoofBaseHeight, uRoofSpan]: [
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
  ]) => {
    const { uLightDir } = lightUniforms;

    const height = select(hasWallData, wallUV.y.mul(wallSize.y), metric.y);
    const climb = select(
      hasWallData,
      wallUV.y,
      metric.y.sub(uRoofBaseHeight).div(max(uRoofSpan, float(1e-3))),
    );

    const warped = warpShapeFn(metric.x, height);
    const warpedHeight = warped.y;

    const n = normalize(worldNormal.add(float(1e-5)));
    const l = normalize(uLightDir.add(float(1e-5)));
    const light = clamp(dot(n, l).mul(0.5).add(0.5), float(0), float(1));

    return roofHorizontalLinesFn(base, warpedHeight, climb, light);
  },
);
