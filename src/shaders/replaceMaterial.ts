import * as THREE from "three";
import { createFacadeMaterial } from "./facade/facadeMaterial";

export const replaceMaterial = (material: THREE.Material) => {
  switch (material.name) {
    case "facade":
      return createFacadeMaterial();

    case "roof":
      return material;

    default:
      return material;
  }
};
