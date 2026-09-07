import * as THREE from "three/webgpu";
import { uniform } from "three/tsl";

export const facadeUniforms = {
  uWindowPitch: uniform(4.0),
  uFloorHeight: uniform(8.0),
  uWindowSize: uniform(new THREE.Vector2(0.3, 0.7)),
  uGroundHeight: uniform(12.0),
  uFloorCount: uniform(2.0),
  uInkColor: uniform(new THREE.Color("#2b2117")),
};

export const placeDauphineDoorUniforms = {
  uDoorPitch: uniform(8.3),
  uDoorWidth: uniform(4.34),
  uDoorBodyHeight: uniform(6.9),
  uDoorArchRadius: uniform(2.1),
  uDoorArchHeight: uniform(2.78),
  uDoorFrameThickness: uniform(0.3),
  uDoorSquareSize: uniform(0.72),
  uDoorPilasterWidth: uniform(1.0),
  uDoorCutSize: uniform(new THREE.Vector2(1.2, 3.5)),
  uDoorCutSide: uniform(1.0),
  uDoorInkColor: uniform(new THREE.Color("#2b2117")),
};

export const hatchingUniforms = {
  uHatchDensity: uniform(2.16),
  uHatchThicknessMin: uniform(0.017),
  uHatchThicknessMax: uniform(0.82),
  uHatchStrength: uniform(0.85),
  uHatchInkColor: uniform(new THREE.Color("#2b2117")),
};

export const lightUniforms = {
  uLightDir: uniform(new THREE.Vector3(-1, 0.4, -1).normalize()),
};

export const floorLineUniforms = {
  uFloorLineOffset: uniform(0.0),
  uFloorLineGap: uniform(0.4),
  uFloorLineThinThickness: uniform(0.1),
  uFloorLineThickThickness: uniform(0.25),
  uFloorLineInkColor: uniform(new THREE.Color("#2b2117")),
};
