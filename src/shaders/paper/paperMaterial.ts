import type { Node } from "three/webgpu";
import { createPaperMaterial } from "./createPaperMaterial";

const passThrough = (base: Node<"color">) => base;

export function createDefaultPaperMaterial() {
  return createPaperMaterial(passThrough);
}
