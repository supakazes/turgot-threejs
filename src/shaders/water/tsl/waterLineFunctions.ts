import { Fn, float, fract, abs, sin, mix, smoothstep, clamp, fwidth, time } from "three/tsl";
import type { Node } from "three/webgpu";
import { waterUniforms } from "../waterUniforms";
import { noiseFn } from "../../paper/tsl/paperFunctions";

export const waterLineFn = Fn(([base, wallUV]: [Node<"color">, Node<"vec2">]) => {
  const {
    uWaterLineDensity,
    uWaterLineThickness,
    uWaterLineStrength,
    uWaterInkColor,
    uWaterFlowSpeed,
    uWaterWaveFreq,
    uWaterWaveAmp,
    uWaterLineWobble,
    uWaterThicknessVar,
    uWaterNoiseScale,
    uWaterNoiseStrength,
  } = waterUniforms;

  const t = time;

  // Primary wave: downstream-propagating sine, makes lines wave together
  const wave1 = sin(wallUV.x.mul(uWaterWaveFreq).add(t.mul(uWaterFlowSpeed))).mul(uWaterWaveAmp);
  // Secondary wobble: different freq + cross-river phase — breaks the perfect-parallel look
  const wave2 = sin(
    wallUV.x.mul(uWaterWaveFreq.mul(float(0.37)))
      .add(wallUV.y.mul(float(7.3)))
      .add(t.mul(uWaterFlowSpeed.mul(float(0.6))))
  ).mul(uWaterLineWobble);
  // Static noise offset: coherent spatial deformation, each line follows a slightly different path
  const noiseOffset = noiseFn(wallUV.mul(uWaterNoiseScale)).sub(float(0.5)).mul(uWaterNoiseStrength);

  const lineCoord = wallUV.y.add(wave1).add(wave2).add(noiseOffset);

  // Thickness varies slowly along both axes — gives a hand-drawn, non-mechanical feel
  const thickMod = sin(wallUV.x.mul(float(17.3)).add(wallUV.y.mul(float(5.7))))
    .mul(uWaterThicknessVar)
    .add(float(1.0));
  const localThickness = uWaterLineThickness.mul(thickMod);

  const slot = fract(lineCoord.mul(uWaterLineDensity));
  const p = abs(slot.sub(float(0.5))).sub(localThickness.mul(float(0.5)));
  const aa = clamp(fwidth(lineCoord.mul(uWaterLineDensity)), float(1e-4), float(0.4));
  const ink = float(1).sub(smoothstep(aa.negate(), aa, p)).mul(uWaterLineStrength);

  return mix(base, uWaterInkColor, ink).toColor();
});
