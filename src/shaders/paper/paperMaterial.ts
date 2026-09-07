import { createPaperMaterial } from "./createPaperMaterial";

const passThrough = (base: any) => base;

export function createDefaultPaperMaterial() {
  return createPaperMaterial(passThrough);
}
