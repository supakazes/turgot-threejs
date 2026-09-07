import { Fn, float, clamp, mix, abs, fract, fwidth, smoothstep } from "three/tsl";
import { hatchingUniforms } from "../facadeUniforms";

export const facadeHatchingFn = Fn(([col_in, along, light]: [any, any, any]) => {
  const { uHatchDensity, uHatchThicknessMin, uHatchThicknessMax, uHatchStrength, uHatchInkColor } =
    hatchingUniforms;

  const shadow = float(1).sub(clamp(light, float(0), float(1)));
  const density = uHatchDensity.mul(mix(float(0.3), float(1), shadow));
  const thickness = mix(uHatchThicknessMin, uHatchThicknessMax, shadow);

  const slot = along.mul(density);
  const p = fract(slot).sub(0.5);
  const d = abs(p).sub(thickness.mul(0.5));
  const aa = clamp(fwidth(slot), float(1e-4), float(0.4));
  const ink = float(1).sub(smoothstep(aa.negate(), aa, d)).mul(uHatchStrength);

  return mix(col_in, uHatchInkColor, ink);
});
