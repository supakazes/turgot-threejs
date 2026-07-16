import * as THREE from "three";
import { createFacadeMaterial } from "./facade/facadeMaterial";
import { createRoofMaterial } from "./roof/roofMaterial";
import { createDefaultPaperMaterial } from "./paper/paperMaterial";

// Maps a mesh material to its paper-based shader by material name.
// Paper is the shared base layer for every surface, so unknown materials
// still fall back to the bare paper look.
export const replaceMaterial = (material: THREE.Material) => {
  switch (material.name) {
    case "facade":
      return createFacadeMaterial();

    case "roof":
      return createRoofMaterial();

    default:
      return createDefaultPaperMaterial();
  }
};
