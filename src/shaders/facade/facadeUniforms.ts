import * as THREE from "three";

// Shared facade-appearance uniforms. Like paperUniforms, every facade material
// references these same objects, so a GUI change updates all facades at once.
export const facadeUniforms = {
  uWindowPitch: { value: 4.0 }, // horizontal spacing between windows (m)
  uFloorHeight: { value: 8 }, // vertical spacing between floors (m)
  uWindowSize: { value: new THREE.Vector2(0.3, 0.7) }, // fraction of a cell
  uGroundHeight: { value: 12.0 }, // height (m) reserved before row 1 starts
  uFloorCount: { value: 2 }, // number of window rows
  uInkColor: { value: new THREE.Color("#2b2117") },
};

// Place Dauphine door arcade (ground floor). Isolated so it can be reused.
export const placeDauphineDoorUniforms = {
  uDoorPitch: { value: 8.3 }, // horizontal spacing between doors (m)
  uDoorWidth: { value: 4.34 }, // door leaf width (m)
  uDoorBodyHeight: { value: 6.9 }, // leaf height up to the arch spring (m)
  uDoorArchRadius: { value: 2.1 }, // arch half-width (m)
  uDoorArchHeight: { value: 2.78 }, // arch rise / height (m)
  uDoorFrameThickness: { value: 0.3 }, // arch ring thickness (m)
  uDoorSquareSize: { value: 0.72 }, // tympanum square side (m)
  uDoorPilasterWidth: { value: 1.0 }, // right-hand pilaster width (m)
  uDoorCutSize: { value: new THREE.Vector2(1.2, 3.5) }, // transparent notch (w, h) (m)
  uDoorCutSide: { value: 1.0 }, // -1 left, +1 right
  uDoorInkColor: { value: new THREE.Color("#2b2117") },
};

// Vertical hatching (engraver's shading strokes). Isolated for reuse.
export const hatchingUniforms = {
  uHatchDensity: { value: 2.0 }, // strokes per meter in full shadow (lit keeps a fraction)
  uHatchThicknessMin: { value: 0.12 }, // stroke thickness when fully lit (0..1 of spacing)
  uHatchThicknessMax: { value: 0.5 }, // stroke thickness when fully shadowed
  uHatchStrength: { value: 0.85 }, // overall hatching opacity (0..1)
  uHatchInkColor: { value: new THREE.Color("#2b2117") },
};

// Fake light direction, shared across facades. Camera-independent: hatching
// darkens facades that turn away from this direction. Set from azimuth +
// elevation in the GUI (see main.ts). Points FROM the surface TOWARD the light.
export const lightUniforms = {
  uLightDir: { value: new THREE.Vector3(-1, 0.4, -1).normalize() },
};

// Double division line between floors (thin + thick band). Isolated for reuse.
export const floorLineUniforms = {
  uFloorLineOffset: { value: 0.0 }, // nudge the pair up/down from the boundary (m)
  uFloorLineGap: { value: 0.4 }, // vertical gap between the thin and thick line (m)
  uFloorLineThinThickness: { value: 0.1 }, // thin line thickness (m)
  uFloorLineThickThickness: { value: 0.25 }, // thick line thickness (m)
  uFloorLineInkColor: { value: new THREE.Color("#2b2117") },
};
