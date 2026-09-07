import { Fn, vec2, float, abs, max, min, length } from "three/tsl";
import type { Node } from "three/webgpu";

export const sdBoxFn = Fn(([p, halfSize]: [Node<"vec2">, Node<"vec2">]) => {
  const dx = abs(p.x).sub(halfSize.x);
  const dy = abs(p.y).sub(halfSize.y);
  const d = vec2(dx, dy);
  return length(max(d, vec2(0, 0))).add(min(max(dx, dy), float(0)));
}).setLayout({
  name: "sdBox",
  type: "float",
  inputs: [
    { name: "p", type: "vec2" },
    { name: "halfSize", type: "vec2" },
  ],
});

export const sdCircleFn = Fn(([p, r]: [Node<"vec2">, Node<"float">]) => {
  return length(p).sub(r);
}).setLayout({
  name: "sdCircle",
  type: "float",
  inputs: [
    { name: "p", type: "vec2" },
    { name: "r", type: "float" },
  ],
});
