import { Fn, vec2, select, float } from "three/tsl";
import type { Node } from "three/webgpu";
import { distortionUniforms } from "../distortionUniforms";
import { fbmFn } from "./paperFunctions";

const warpOffsetXFn = Fn(([px, py]: [Node<"float">, Node<"float">]) => {
  const { uDistortStrength, uDistortScale } = distortionUniforms;
  const nx = fbmFn(vec2(px, py).mul(uDistortScale).add(13.1));
  return select(uDistortStrength.lessThanEqual(0.0), float(0), nx.sub(0.5).mul(uDistortStrength));
}).setLayout({
  name: "warpOffsetX",
  type: "float",
  inputs: [
    { name: "px", type: "float" },
    { name: "py", type: "float" },
  ],
});

const warpOffsetYFn = Fn(([px, py]: [Node<"float">, Node<"float">]) => {
  const { uDistortStrength, uDistortScale } = distortionUniforms;
  const ny = fbmFn(vec2(px, py).mul(uDistortScale).add(71.7));
  return select(uDistortStrength.lessThanEqual(0.0), float(0), ny.sub(0.5).mul(uDistortStrength));
}).setLayout({
  name: "warpOffsetY",
  type: "float",
  inputs: [
    { name: "px", type: "float" },
    { name: "py", type: "float" },
  ],
});

export function warpShapeFn(px: Node<"float">, py: Node<"float">) {
  return {
    x: px.add(warpOffsetXFn(px, py)),
    y: py.add(warpOffsetYFn(px, py)),
  };
}
