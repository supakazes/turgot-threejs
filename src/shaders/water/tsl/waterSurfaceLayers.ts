import { Fn } from "three/tsl";
import type { Node } from "three/webgpu";
import { waterLineFn } from "./waterLineFunctions";

export const waterSurfaceLayersFn = Fn(
  ([base, _uvPaper, wallUV, _wallSize, _metric, _hasWallData, _worldNormal]: [
    Node<"color">,
    Node<"vec2">,
    Node<"vec2">,
    Node<"vec2">,
    Node<"vec2">,
    Node<"bool">,
    Node<"vec3">,
  ]) => {
    return waterLineFn(base, wallUV);
  },
);
