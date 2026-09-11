import { Fn, float, fract, abs, sin, mix, smoothstep, clamp, fwidth, time } from "three/tsl";
import type { Node } from "three/webgpu";
import { waterUniforms } from "../waterUniforms";

export const waterLineFn = Fn(([base, wallUV]: [Node<"color">, Node<"vec2">]) => {
  const {
    uWaterLineDensity,
    uWaterLineThickness,
    uWaterLineStrength,
    uWaterInkColor,
    uWaterFlowSpeed,
    uWaterWaveFreq,
    uWaterWaveAmp,
  } = waterUniforms;

  const t = time;

  // UV.x = along-flow, UV.y = cross-river (bank to bank)
  // Wave propagates downstream (UV.x), lines are iso-contours of UV.y
  const lineCoord = wallUV.y.add(
    sin(wallUV.x.mul(uWaterWaveFreq).add(t.mul(uWaterFlowSpeed))).mul(uWaterWaveAmp),
  );

  const slot = fract(lineCoord.mul(uWaterLineDensity));
  const p = abs(slot.sub(float(0.5))).sub(uWaterLineThickness.mul(float(0.5)));
  const aa = clamp(fwidth(lineCoord.mul(uWaterLineDensity)), float(1e-4), float(0.4));
  const ink = float(1).sub(smoothstep(aa.negate(), aa, p)).mul(uWaterLineStrength);

  return mix(base, uWaterInkColor, ink).toColor();
});
