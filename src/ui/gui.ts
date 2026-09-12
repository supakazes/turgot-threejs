import * as THREE from "three/webgpu";
import { Inspector } from "three/addons/inspector/Inspector.js";
import { paperUniforms } from "../shaders/paper/paperUniforms";
import { imperfectionUniforms } from "../shaders/paper/imperfectionUniforms";
import { distortionUniforms } from "../shaders/paper/distortionUniforms";
import {
  facadeUniforms,
  placeDauphineDoorUniforms,
  floorLineUniforms,
  hatchingUniforms,
} from "../shaders/facade/facadeUniforms";
import { roofLineUniforms } from "../shaders/roof/roofUniforms";
import { waterUniforms } from "../shaders/water/waterUniforms";

export interface GuiParams {
  showImageMap: boolean;
  buildings: boolean;
  showEdges: boolean;
  elevationScale: number;
}

export interface GuiModels {
  floor: THREE.Object3D | undefined;
  regularBuildings: THREE.Object3D[];
  placeDauphine: THREE.Object3D | undefined;
}

export interface GuiLightParams {
  azimuth: number;
  elevation: number;
}

export interface GuiDeps {
  renderer: THREE.WebGPURenderer;
  params: GuiParams;
  models: GuiModels;
  setEdgesVisible: (visible: boolean) => void;
  lightArrow: THREE.ArrowHelper;
  lightParams: GuiLightParams;
  updateLightDir: () => void;
}

export function createGui({
  renderer,
  params,
  models,
  setEdgesVisible,
  lightArrow,
  lightParams,
  updateLightDir,
}: GuiDeps) {
  const inspector = new Inspector();
  renderer.inspector = inspector;

  const scene = inspector.createParameters("Scene");

  scene
    .add(params, "showImageMap")
    .name("Show image map")
    .onChange((visible) => {
      if (models.floor) models.floor.visible = visible;
    });

  scene.add(params, "buildings").onChange((visible) => {
    models.regularBuildings?.forEach((obj) => {
      obj.visible = visible;
    });
    if (models.placeDauphine) models.placeDauphine.visible = visible;
  });

  scene
    .add(params, "showEdges")
    .name("Edges")
    .onChange((visible) => setEdgesVisible(visible));

  // Paper
  const paper = scene.addFolder("Paper").close();

  const paperColor = { base: `#${paperUniforms.uPaperBaseColor.value.getHexString()}` };
  paper
    .addColor(paperColor, "base")
    .name("Base color")
    .onChange((hex) => paperUniforms.uPaperBaseColor.value.set(hex));

  paper.add(paperUniforms.uStain1Scale, "value", 0.5, 20).name("Stain 1 scale");
  paper.add(paperUniforms.uStain1Strength, "value", 0, 0.3).name("Stain 1 strength");
  paper.add(paperUniforms.uStain2Scale, "value", 1, 40).name("Stain 2 scale");
  paper.add(paperUniforms.uStain2Strength, "value", 0, 0.5).name("Stain 2 strength");
  paper.add(paperUniforms.uWarpStrength, "value", 0, 1.5).name("Warp strength");

  paper.add(paperUniforms.uSpeck1Scale, "value", 0, 10).name("Speck 1 scale");
  paper.add(paperUniforms.uSpeck1Density, "value", 0, 1).name("Speck 1 density");
  paper.add(paperUniforms.uSpeck1Size, "value", 0.02, 0.4).name("Speck 1 size");
  paper.add(paperUniforms.uSpeck1Strength, "value", 0, 1).name("Speck 1 strength");

  paper.add(paperUniforms.uSpeck2Scale, "value", 0, 20).name("Speck 2 scale");
  paper.add(paperUniforms.uSpeck2Density, "value", 0, 1).name("Speck 2 density");
  paper.add(paperUniforms.uSpeck2Size, "value", 0.02, 0.4).name("Speck 2 size");
  paper.add(paperUniforms.uSpeck2Strength, "value", 0, 1).name("Speck 2 strength");

  // Imperfections
  const imperfections = scene.addFolder("Imperfections").close();

  imperfections.add(imperfectionUniforms.uInkBreakupScale, "value", 0.5, 40).name("Breakup scale");
  imperfections
    .add(imperfectionUniforms.uInkBreakupStrength, "value", 0, 1)
    .name("Breakup strength");
  imperfections.add(imperfectionUniforms.uInkTransparency, "value", 0, 1).name("Ink transparency");
  imperfections.add(imperfectionUniforms.uPaperGrainScale, "value", 1, 120).name("Grain scale");
  imperfections
    .add(imperfectionUniforms.uPaperGrainStrength, "value", 0, 0.3)
    .name("Grain strength");

  // Distortion
  const distortion = scene.addFolder("Distortion").close();

  distortion.add(distortionUniforms.uDistortStrength, "value", 0, 1).name("Strength (m)");
  distortion.add(distortionUniforms.uDistortScale, "value", 0.2, 20).name("Scale");

  // Facade
  const facade = scene.addFolder("Facade").close();

  facade.add(facadeUniforms.uWindowPitch, "value", 1, 12).name("Window pitch (m)");
  facade.add(facadeUniforms.uFloorHeight, "value", 1, 8).name("Floor height (m)");
  facade.add(facadeUniforms.uWindowSize.value, "x", 0.1, 1).name("Window width");
  facade.add(facadeUniforms.uWindowSize.value, "y", 0.1, 1).name("Window height");
  facade.add(facadeUniforms.uGroundHeight, "value", 0, 20).name("Ground height (m)");
  facade.add(facadeUniforms.uFloorCount, "value", 1, 10, 1).name("Floor count");

  const facadeColor = { ink: `#${facadeUniforms.uInkColor.value.getHexString()}` };
  facade
    .addColor(facadeColor, "ink")
    .name("Ink color")
    .onChange((hex) => facadeUniforms.uInkColor.value.set(hex));

  // Place Dauphine doors
  const door = scene.addFolder("Place Dauphine doors").close();

  door.add(placeDauphineDoorUniforms.uDoorPitch, "value", 1, 12).name("Door pitch (m)");
  door.add(placeDauphineDoorUniforms.uDoorWidth, "value", 0.5, 6).name("Door width (m)");
  door.add(placeDauphineDoorUniforms.uDoorBodyHeight, "value", 1, 12).name("Body height (m)");
  door.add(placeDauphineDoorUniforms.uDoorArchRadius, "value", 0.2, 4).name("Arch width (m)");
  door.add(placeDauphineDoorUniforms.uDoorArchHeight, "value", 0.2, 5).name("Arch height (m)");
  door
    .add(placeDauphineDoorUniforms.uDoorFrameThickness, "value", 0.05, 1)
    .name("Frame thickness (m)");
  door.add(placeDauphineDoorUniforms.uDoorSquareSize, "value", 0.1, 2).name("Square size (m)");
  door
    .add(placeDauphineDoorUniforms.uDoorPilasterWidth, "value", 0.05, 1.5)
    .name("Pilaster width (m)");
  door.add(placeDauphineDoorUniforms.uDoorCutSize.value, "x", 0, 4).name("Notch width (m)");
  door.add(placeDauphineDoorUniforms.uDoorCutSize.value, "y", 0, 8).name("Notch height (m)");
  door
    .add(placeDauphineDoorUniforms.uDoorCutSide, "value", { Left: -1, Right: 1 })
    .name("Notch side");

  const doorColor = { ink: `#${placeDauphineDoorUniforms.uDoorInkColor.value.getHexString()}` };
  door
    .addColor(doorColor, "ink")
    .name("Ink color")
    .onChange((hex) => placeDauphineDoorUniforms.uDoorInkColor.value.set(hex));

  // Floor lines
  const floorLine = scene.addFolder("Floor lines").close();

  floorLine.add(floorLineUniforms.uFloorLineOffset, "value", -4, 4).name("Offset (m)");
  floorLine.add(floorLineUniforms.uFloorLineGap, "value", 0, 2).name("Gap (m)");
  floorLine
    .add(floorLineUniforms.uFloorLineThinThickness, "value", 0.01, 1)
    .name("Thin thickness (m)");
  floorLine
    .add(floorLineUniforms.uFloorLineThickThickness, "value", 0.01, 1)
    .name("Thick thickness (m)");

  const floorLineColor = {
    ink: `#${floorLineUniforms.uFloorLineInkColor.value.getHexString()}`,
  };
  floorLine
    .addColor(floorLineColor, "ink")
    .name("Ink color")
    .onChange((hex) => floorLineUniforms.uFloorLineInkColor.value.set(hex));

  // Facade hatching
  const hatching = scene.addFolder("Facade hatching").close();

  hatching.add(hatchingUniforms.uHatchDensity, "value", 0, 6).name("Density (lines/m)");
  hatching.add(hatchingUniforms.uHatchThicknessMin, "value", 0, 1).name("Thickness (lit)");
  hatching.add(hatchingUniforms.uHatchThicknessMax, "value", 0, 1).name("Thickness (shadow)");
  hatching.add(hatchingUniforms.uHatchStrength, "value", 0, 1).name("Strength");

  const hatchingColor = { ink: `#${hatchingUniforms.uHatchInkColor.value.getHexString()}` };
  hatching
    .addColor(hatchingColor, "ink")
    .name("Ink color")
    .onChange((hex) => hatchingUniforms.uHatchInkColor.value.set(hex));

  // Roof lines
  const roofLine = scene.addFolder("Roof lines").close();

  roofLine.add(roofLineUniforms.uRoofLineDensity, "value", 0, 6).name("Density eave (lines/m)");
  roofLine
    .add(roofLineUniforms.uRoofLineDensityGrowth, "value", 0, 1)
    .name("Density ridge (+lines/m)");
  roofLine.add(roofLineUniforms.uRoofLineThicknessMin, "value", 0, 1).name("Thickness eave");
  roofLine.add(roofLineUniforms.uRoofLineThicknessMax, "value", 0, 1).name("Thickness ridge");
  roofLine.add(roofLineUniforms.uRoofLineShadowBoost, "value", 0, 1).name("Shadow boost");
  roofLine.add(roofLineUniforms.uRoofLineStrength, "value", 0, 1).name("Strength");

  const roofLineColor = { ink: `#${roofLineUniforms.uRoofLineInkColor.value.getHexString()}` };
  roofLine
    .addColor(roofLineColor, "ink")
    .name("Ink color")
    .onChange((hex) => roofLineUniforms.uRoofLineInkColor.value.set(hex));

  // Water
  const water = scene.addFolder("Water / La Seine").close();

  water.add(waterUniforms.uWaterLineDensity, "value", 5, 400).name("Density (lines/UV)");
  water.add(waterUniforms.uWaterLineThickness, "value", 0.01, 0.5).name("Thickness");
  water.add(waterUniforms.uWaterLineStrength, "value", 0, 1).name("Strength");
  water.add(waterUniforms.uWaterFlowSpeed, "value", 0, 0.5).name("Flow speed");
  water.add(waterUniforms.uWaterWaveFreq, "value", 0, 20).name("Wave frequency");
  water.add(waterUniforms.uWaterWaveAmp, "value", 0, 0.1).name("Wave amplitude");
  water.add(waterUniforms.uWaterLineWobble, "value", 0, 0.05).name("Line wobble");
  water.add(waterUniforms.uWaterThicknessVar, "value", 0, 0.5).name("Thickness variation");
  water.add(waterUniforms.uWaterNoiseScale, "value", 0.5, 20).name("Noise scale");
  water.add(waterUniforms.uWaterNoiseStrength, "value", 0, 0.03).name("Noise strength");

  const waterColor = { ink: `#${waterUniforms.uWaterInkColor.value.getHexString()}` };
  water
    .addColor(waterColor, "ink")
    .name("Ink color")
    .onChange((hex) => waterUniforms.uWaterInkColor.value.set(hex));

  // Sun direction
  const light = scene.addFolder("Sun direction (fake light)").close();

  light.add(lightParams, "azimuth", 0, 360, 1).name("Azimuth (deg)").onChange(updateLightDir);
  light.add(lightParams, "elevation", 0, 90, 1).name("Elevation (deg)").onChange(updateLightDir);
  light.add(lightArrow, "visible");

  return inspector;
}
