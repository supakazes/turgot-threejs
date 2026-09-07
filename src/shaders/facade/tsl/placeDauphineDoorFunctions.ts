import {
  Fn,
  vec2,
  float,
  min,
  max,
  mix,
  fract,
  fwidth,
  clamp,
  smoothstep,
  select,
} from "three/tsl";
import type { Node } from "three/webgpu";
import { placeDauphineDoorUniforms } from "../facadeUniforms";
import { sdBoxFn, sdCircleFn } from "./sdfFunctions";

export const placeDauphineDoorDistFn = Fn(([p]: [Node<"vec2">]) => {
  const {
    uDoorWidth,
    uDoorBodyHeight,
    uDoorArchRadius,
    uDoorArchHeight,
    uDoorFrameThickness,
    uDoorSquareSize,
    uDoorPilasterWidth,
    uDoorCutSize,
    uDoorCutSide,
  } = placeDauphineDoorUniforms;

  const leaf = sdBoxFn(
    p.sub(vec2(float(0), uDoorBodyHeight.mul(0.5))),
    vec2(uDoorWidth.mul(0.5), uDoorBodyHeight.mul(0.5)),
  );

  const cutX = uDoorCutSide
    .mul(uDoorWidth.mul(0.5).sub(uDoorCutSize.x.mul(0.5)))
    .sub(0.1);
  const cutY = uDoorCutSize.y.mul(0.5);
  const cut = sdBoxFn(p.sub(vec2(cutX, cutY)), uDoorCutSize.mul(0.5));
  const leafFinal = max(leaf, cut.negate());

  const baseH = uDoorBodyHeight.mul(0.12);
  const baseRect = sdBoxFn(
    p.sub(vec2(float(0), baseH.mul(0.5))),
    vec2(uDoorWidth.mul(0.72), baseH.mul(0.5)),
  );

  const archP = p.sub(vec2(float(0), uDoorBodyHeight));
  const squash = uDoorArchRadius.div(max(uDoorArchHeight, float(1e-4)));
  const archC = vec2(archP.x, archP.y.mul(squash));
  const outer = sdCircleFn(archC, uDoorArchRadius).div(squash);
  const inner = sdCircleFn(archC, uDoorArchRadius.sub(uDoorFrameThickness)).div(squash);
  const ring = max(outer, inner.negate());
  const arch = max(ring, archP.y.negate());

  const squareY = uDoorBodyHeight.add(uDoorArchHeight.mul(0.45));
  const square = sdBoxFn(
    p.sub(vec2(float(0), squareY)),
    vec2(uDoorSquareSize.mul(0.5), uDoorSquareSize.mul(0.5)),
  );

  const pilasterX = uDoorWidth.mul(0.5).add(uDoorPilasterWidth);
  const pilasterH = uDoorBodyHeight.sub(1.5);
  const pilaster = sdBoxFn(
    p.sub(vec2(pilasterX, pilasterH.mul(0.5))),
    vec2(uDoorPilasterWidth.mul(0.5), pilasterH.mul(0.5)),
  );

  let d = leafFinal;
  d = min(d, baseRect);
  d = min(d, arch);
  d = min(d, square);
  d = min(d, pilaster);
  return d;
});

export const placeDauphineDoorsFn = Fn(([base, along, height]: [Node<"color">, Node<"float">, Node<"float">]) => {
  const { uDoorPitch, uDoorInkColor } = placeDauphineDoorUniforms;

  const localX = fract(along.div(uDoorPitch)).sub(0.5).mul(uDoorPitch);
  const p = vec2(localX, height);
  const d = placeDauphineDoorDistFn(p);

  const aa = clamp(max(fwidth(along), fwidth(height)), float(1e-4), float(0.05));
  const ink = float(1).sub(smoothstep(aa.negate(), aa, d));

  return select(height.lessThan(0.0), base, mix(base, uDoorInkColor, ink)).toColor();
});
