import {
  Fn,
  vec2,
  vec3,
  float,
  fract,
  floor,
  dot,
  mix,
  distance,
  smoothstep,
  Loop,
  select,
} from "three/tsl";
import type { Node } from "three/webgpu";
import { paperUniforms } from "../paperUniforms";

export const hashFn = Fn(([p]: [Node<"vec2">]) => {
  const p3 = fract(vec3(p.xyx).mul(0.1031)).toVar();
  p3.addAssign(dot(p3, p3.yzx.add(33.33)));
  return fract(p3.x.add(p3.y).mul(p3.z));
}).setLayout({ name: "hash", type: "float", inputs: [{ name: "p", type: "vec2" }] });

export const hash2Fn = Fn(([p]: [Node<"vec2">]) => {
  return vec2(hashFn(p), hashFn(p.add(17.13)));
}).setLayout({ name: "hash2", type: "vec2", inputs: [{ name: "p", type: "vec2" }] });

export const noiseFn = Fn(([p]: [Node<"vec2">]) => {
  const i = floor(p);
  const a = hashFn(i);
  const b = hashFn(i.add(vec2(1, 0)));
  const c = hashFn(i.add(vec2(0, 1)));
  const d = hashFn(i.add(vec2(1, 1)));
  const fx = fract(p.x);
  const fy = fract(p.y);
  const ux = fx.mul(fx).mul(float(3).sub(fx.mul(2)));
  const uy = fy.mul(fy).mul(float(3).sub(fy.mul(2)));
  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}).setLayout({ name: "noise", type: "float", inputs: [{ name: "p", type: "vec2" }] });

export const fbmFn = Fn(([p_in]: [Node<"vec2">]) => {
  const px = float(0).toVar();
  const py = float(0).toVar();
  px.assign(p_in.x);
  py.assign(p_in.y);
  const value = float(0).toVar();
  const amp = float(0.5).toVar();
  Loop(5, () => {
    value.addAssign(amp.mul(noiseFn(vec2(px, py))));
    const nextX = float(0.8).mul(px).sub(float(0.6).mul(py)).mul(2.0);
    const nextY = float(0.6).mul(px).add(float(0.8).mul(py)).mul(2.0);
    px.assign(nextX);
    py.assign(nextY);
    amp.mulAssign(0.5);
  });
  return value;
}).setLayout({ name: "fbm", type: "float", inputs: [{ name: "p_in", type: "vec2" }] });

const specksFn = Fn(([uv_, scale, density, size, seed]: [Node<"vec2">, Node<"float">, Node<"float">, Node<"float">, Node<"float">]) => {
  const scaledUV = uv_.mul(scale);
  const cell = floor(scaledUV).add(seed).toVar();
  const f = fract(scaledUV);
  const center = hash2Fn(cell).mul(0.6).add(0.2);
  const dist = distance(f, center);
  const dotVal = float(1).sub(smoothstep(float(0), size, dist));
  const darkness = float(0.5).add(float(0.5).mul(hashFn(cell.add(9.1))));
  return select(hashFn(cell.add(3.7)).lessThanEqual(density), dotVal.mul(darkness), float(0));
}).setLayout({
  name: "specks",
  type: "float",
  inputs: [
    { name: "uv_", type: "vec2" },
    { name: "scale", type: "float" },
    { name: "density", type: "float" },
    { name: "size", type: "float" },
    { name: "seed", type: "float" },
  ],
});

export const paperColorFn = Fn(([uvCoord]: [Node<"vec2">]) => {
  const {
    uPaperBaseColor,
    uStain1Scale,
    uStain1Strength,
    uStain2Scale,
    uStain2Strength,
    uWarpStrength,
    uSpeck1Scale,
    uSpeck1Density,
    uSpeck1Size,
    uSpeck1Strength,
    uSpeck2Scale,
    uSpeck2Density,
    uSpeck2Size,
    uSpeck2Strength,
  } = paperUniforms;

  const color = uPaperBaseColor.toVar();

  const warp = vec2(
    fbmFn(uvCoord.mul(uStain1Scale).add(5.2)),
    fbmFn(uvCoord.mul(uStain1Scale).add(1.3)),
  );
  const wuv = uvCoord.add(warp.sub(0.5).mul(uWarpStrength));

  const stain1 = fbmFn(wuv.mul(uStain1Scale));
  color.assign(color.add(stain1.sub(0.5).mul(uStain1Strength)));

  const stain2 = fbmFn(wuv.mul(uStain2Scale));
  color.assign(color.add(stain2.sub(0.5).mul(uStain2Strength)));

  color.assign(
    color.sub(specksFn(uvCoord, uSpeck1Scale, uSpeck1Density, uSpeck1Size, float(0)).mul(uSpeck1Strength)),
  );
  color.assign(
    color.sub(specksFn(uvCoord, uSpeck2Scale, uSpeck2Density, uSpeck2Size, float(41)).mul(uSpeck2Strength)),
  );

  return color;
});
