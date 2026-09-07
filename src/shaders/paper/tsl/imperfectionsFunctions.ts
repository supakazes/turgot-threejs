import { Fn, vec3, float, dot, clamp, mix, smoothstep } from "three/tsl";
import { imperfectionUniforms } from "../imperfectionUniforms";
import { fbmFn } from "./paperFunctions";

export const applyImperfectionsFn = Fn(([color_in, base, uvCoord]: [any, any, any]) => {
  const {
    uInkBreakupScale,
    uInkBreakupStrength,
    uInkTransparency,
    uPaperGrainScale,
    uPaperGrainStrength,
  } = imperfectionUniforms;

  const color = color_in.toVar();
  const luma = vec3(0.299, 0.587, 0.114);
  const baseLuma = dot(base, luma);
  const colLuma = dot(color, luma);
  const inkMask = clamp(
    baseLuma.sub(colLuma).div(clamp(baseLuma, float(1e-3), float(1e10))),
    float(0),
    float(1),
  );

  color.assign(mix(color, base, uInkTransparency.mul(inkMask)));

  const n = fbmFn(uvCoord.mul(uInkBreakupScale));
  const erode = smoothstep(float(0.35), float(0.65), n).mul(uInkBreakupStrength);
  color.assign(mix(color, base, erode.mul(inkMask)));

  const grain = fbmFn(uvCoord.mul(uPaperGrainScale)).sub(0.5);
  color.addAssign(grain.mul(uPaperGrainStrength));

  return color;
});
