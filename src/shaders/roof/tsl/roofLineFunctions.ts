import { Fn, float, clamp, mix, abs, fract, fwidth, smoothstep } from "three/tsl";
import { roofLineUniforms } from "../roofUniforms";

export const roofHorizontalLinesFn = Fn(([col_in, height, climb, light]: [any, any, any, any]) => {
  const {
    uRoofLineDensity,
    uRoofLineDensityGrowth,
    uRoofLineThicknessMin,
    uRoofLineThicknessMax,
    uRoofLineShadowBoost,
    uRoofLineStrength,
    uRoofLineInkColor,
  } = roofLineUniforms;

  const t = clamp(climb, float(0), float(1));
  const shadow = float(1).sub(clamp(light, float(0), float(1)));

  const freq = uRoofLineDensity.add(uRoofLineDensityGrowth.mul(t));
  const phase = height.mul(freq);

  const thickness = mix(uRoofLineThicknessMin, uRoofLineThicknessMax, t).mul(
    float(1).add(uRoofLineShadowBoost.mul(shadow)),
  );

  const p = fract(phase).sub(0.5);
  const d = abs(p).sub(thickness.mul(0.5));
  const aa = clamp(fwidth(phase), float(1e-4), float(0.4));
  const ink = float(1).sub(smoothstep(aa.negate(), aa, d)).mul(uRoofLineStrength);

  return mix(col_in, uRoofLineInkColor, ink);
});
