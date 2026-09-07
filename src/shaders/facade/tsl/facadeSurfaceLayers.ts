import {
  Fn,
  vec2,
  vec3,
  float,
  select,
  fract,
  floor,
  clamp,
  max,
  mix,
  smoothstep,
  fwidth,
  normalize,
  dot,
  If,
} from "three/tsl";
import type { Node } from "three/webgpu";
import { facadeUniforms, lightUniforms } from "../facadeUniforms";
import { warpShapeFn } from "../../paper/tsl/distortionFunctions";
import { sdBoxFn } from "./sdfFunctions";
import { facadeFloorLinesFn } from "./floorLineFunctions";
import { facadeHatchingFn } from "./hatchingFunctions";
import { placeDauphineDoorsFn } from "./placeDauphineDoorFunctions";

export const facadeSurfaceLayersFn = Fn(
  ([base, _uvPaper, wallUV, wallSize, metric, hasWallData, worldNormal]: [
    Node<"color">,
    Node<"vec2">,
    Node<"vec2">,
    Node<"vec2">,
    Node<"vec2">,
    Node<"bool">,
    Node<"vec3">,
  ]) => {
    const { uWindowPitch, uFloorHeight, uWindowSize, uGroundHeight, uFloorCount, uInkColor } =
      facadeUniforms;
    const { uLightDir } = lightUniforms;

    const along = select(hasWallData, wallUV.x.mul(wallSize.x), metric.x).toVar();
    const height = select(hasWallData, wallUV.y.mul(wallSize.y), metric.y).toVar();

    const warped = warpShapeFn(along, height);
    along.assign(warped.x);
    height.assign(warped.y);

    const col = placeDauphineDoorsFn(base, along, height).toVar();
    col.assign(facadeFloorLinesFn(col, height, uGroundHeight, uFloorHeight, uFloorCount));

    const rowSpan = height.sub(uGroundHeight).toVar();
    const row = floor(rowSpan.div(uFloorHeight));

    If(rowSpan.greaterThanEqual(0.0).and(row.lessThan(uFloorCount)), () => {
      const cellCoord = vec2(along.div(uWindowPitch), rowSpan.div(uFloorHeight));
      const cell = fract(cellCoord).sub(0.5);
      const halfSize = uWindowSize.mul(0.5);
      const d = sdBoxFn(cell, halfSize);
      const aa = clamp(max(fwidth(cellCoord.x), fwidth(cellCoord.y)), float(1e-4), float(0.05));
      const ink = float(1).sub(smoothstep(aa.negate(), aa, d));
      col.assign(mix(col, uInkColor, ink));
    });

    const flatNormal = normalize(vec3(worldNormal.x, float(0), worldNormal.z).add(float(1e-5)));
    const flatLight = normalize(vec3(uLightDir.x, float(0), uLightDir.z).add(float(1e-5)));
    const light = clamp(dot(flatNormal, flatLight).mul(0.5).add(0.5), float(0), float(1));

    col.assign(facadeHatchingFn(col, along, light));

    return col;
  },
);
