import * as THREE from "three";
import GUI from "lil-gui";
import { paperUniforms } from "../shaders/paper/paperUniforms";
import { imperfectionUniforms } from "../shaders/paper/imperfectionUniforms";
import { distortionUniforms } from "../shaders/paper/distortionUniforms";
import {
  facadeUniforms,
  placeDauphineDoorUniforms,
  floorLineUniforms,
  hatchingUniforms,
} from "../shaders/facade/facadeUniforms";

export interface GuiParams {
  showMap: boolean;
  buildings: boolean;
  showEdges: boolean;
}

export interface GuiModels {
  frame: THREE.Object3D | undefined;
  regularBuildings: THREE.Object3D[];
  placeDauphine: THREE.Object3D | undefined;
}

export interface GuiLightParams {
  azimuth: number;
  elevation: number;
}

export interface GuiDeps {
  params: GuiParams;
  models: GuiModels;
  setEdgesVisible: (visible: boolean) => void;
  lightArrow: THREE.ArrowHelper;
  lightParams: GuiLightParams;
  updateLightDir: () => void;
}

export function createGui({
  params,
  models,
  setEdgesVisible,
  lightArrow,
  lightParams,
  updateLightDir,
}: GuiDeps) {
  const gui = new GUI({ closeFolders: true, container: document.getElementById("gui-container")! });

  // gui: show map floor
  gui
    .add(params, "showMap")
    .name("Map")
    .onChange((visible: boolean) => {
      if (models.frame) {
        models.frame.visible = visible;
      }
    });

  // gui: buildings layer
  gui
    .add(params, "buildings")
    .name("Buildings")
    .onChange((visible: boolean) => {
      models.regularBuildings?.forEach((obj) => {
        obj.visible = visible;
      });

      if (models.placeDauphine) {
        models.placeDauphine.visible = visible;
      }
    });

  // gui: edge overlay
  gui
    .add(params, "showEdges")
    .name("Edges")
    .onChange((visible: boolean) => setEdgesVisible(visible));

  // gui: paper fine-tuning
  const paperFolder = gui.addFolder("Paper");

  const paperColor = {
    base: `#${paperUniforms.uPaperBaseColor.value.getHexString()}`,
  };
  paperFolder
    .addColor(paperColor, "base")
    .name("Base color")
    .onChange((hex: string) => paperUniforms.uPaperBaseColor.value.set(hex));

  paperFolder.add(paperUniforms.uStain1Scale, "value", 0.5, 20).name("Stain 1 scale");
  paperFolder.add(paperUniforms.uStain1Strength, "value", 0, 0.3).name("Stain 1 strength");
  paperFolder.add(paperUniforms.uStain2Scale, "value", 1, 40).name("Stain 2 scale");
  paperFolder.add(paperUniforms.uStain2Strength, "value", 0, 0.5).name("Stain 2 strength");
  paperFolder.add(paperUniforms.uWarpStrength, "value", 0, 1.5).name("Warp strength");

  paperFolder.add(paperUniforms.uSpeck1Scale, "value", 0, 10).name("Speck 1 scale");
  paperFolder.add(paperUniforms.uSpeck1Density, "value", 0, 1).name("Speck 1 density");
  paperFolder.add(paperUniforms.uSpeck1Size, "value", 0.02, 0.4).name("Speck 1 size");
  paperFolder.add(paperUniforms.uSpeck1Strength, "value", 0, 1).name("Speck 1 strength");

  paperFolder.add(paperUniforms.uSpeck2Scale, "value", 0, 20).name("Speck 2 scale");
  paperFolder.add(paperUniforms.uSpeck2Density, "value", 0, 1).name("Speck 2 density");
  paperFolder.add(paperUniforms.uSpeck2Size, "value", 0.02, 0.4).name("Speck 2 size");
  paperFolder.add(paperUniforms.uSpeck2Strength, "value", 0, 1).name("Speck 2 strength");

  // gui: imperfections (shared post-shape pass, applied to every facade/roof)
  const imperfectionsFolder = gui.addFolder("Imperfections");

  imperfectionsFolder
    .add(imperfectionUniforms.uInkBreakupScale, "value", 0.5, 40)
    .name("Breakup scale");
  imperfectionsFolder
    .add(imperfectionUniforms.uInkBreakupStrength, "value", 0, 1)
    .name("Breakup strength");
  imperfectionsFolder
    .add(imperfectionUniforms.uInkTransparency, "value", 0, 1)
    .name("Ink transparency");
  imperfectionsFolder
    .add(imperfectionUniforms.uPaperGrainScale, "value", 1, 120)
    .name("Grain scale");
  imperfectionsFolder
    .add(imperfectionUniforms.uPaperGrainStrength, "value", 0, 0.3)
    .name("Grain strength");

  // gui: shape distortion (pre-shape coordinate warp; wavy outlines)
  const distortionFolder = gui.addFolder("Distortion");

  distortionFolder.add(distortionUniforms.uDistortStrength, "value", 0, 1).name("Strength (m)");
  distortionFolder.add(distortionUniforms.uDistortScale, "value", 0.2, 20).name("Scale");

  // gui: facade windows
  const facadeFolder = gui.addFolder("Facade");

  facadeFolder.add(facadeUniforms.uWindowPitch, "value", 1, 12).name("Window pitch (m)");
  facadeFolder.add(facadeUniforms.uFloorHeight, "value", 1, 8).name("Floor height (m)");
  facadeFolder.add(facadeUniforms.uWindowSize.value, "x", 0.1, 1).name("Window width");
  facadeFolder.add(facadeUniforms.uWindowSize.value, "y", 0.1, 1).name("Window height");
  facadeFolder.add(facadeUniforms.uGroundHeight, "value", 0, 20).name("Ground height (m)");
  facadeFolder.add(facadeUniforms.uFloorCount, "value", 1, 10, 1).name("Floor count");

  const facadeColor = {
    ink: `#${facadeUniforms.uInkColor.value.getHexString()}`,
  };
  facadeFolder
    .addColor(facadeColor, "ink")
    .name("Ink color")
    .onChange((hex: string) => facadeUniforms.uInkColor.value.set(hex));

  // gui: Place Dauphine door arcade
  const doorFolder = gui.addFolder("Place Dauphine doors");

  doorFolder.add(placeDauphineDoorUniforms.uDoorPitch, "value", 1, 12).name("Door pitch (m)");
  doorFolder.add(placeDauphineDoorUniforms.uDoorWidth, "value", 0.5, 6).name("Door width (m)");
  doorFolder.add(placeDauphineDoorUniforms.uDoorBodyHeight, "value", 1, 12).name("Body height (m)");
  doorFolder.add(placeDauphineDoorUniforms.uDoorArchRadius, "value", 0.2, 4).name("Arch width (m)");
  doorFolder
    .add(placeDauphineDoorUniforms.uDoorArchHeight, "value", 0.2, 5)
    .name("Arch height (m)");
  doorFolder
    .add(placeDauphineDoorUniforms.uDoorFrameThickness, "value", 0.05, 1)
    .name("Frame thickness (m)");
  doorFolder
    .add(placeDauphineDoorUniforms.uDoorSquareSize, "value", 0.1, 2)
    .name("Square size (m)");
  doorFolder
    .add(placeDauphineDoorUniforms.uDoorPilasterWidth, "value", 0.05, 1.5)
    .name("Pilaster width (m)");
  doorFolder.add(placeDauphineDoorUniforms.uDoorCutSize.value, "x", 0, 4).name("Notch width (m)");
  doorFolder.add(placeDauphineDoorUniforms.uDoorCutSize.value, "y", 0, 8).name("Notch height (m)");
  doorFolder
    .add(placeDauphineDoorUniforms.uDoorCutSide, "value", { Left: -1, Right: 1 })
    .name("Notch side");

  const doorColor = {
    ink: `#${placeDauphineDoorUniforms.uDoorInkColor.value.getHexString()}`,
  };
  doorFolder
    .addColor(doorColor, "ink")
    .name("Ink color")
    .onChange((hex: string) => placeDauphineDoorUniforms.uDoorInkColor.value.set(hex));

  // gui: floor division lines (double band between floors)
  const floorLineFolder = gui.addFolder("Floor lines");

  floorLineFolder.add(floorLineUniforms.uFloorLineOffset, "value", -4, 4).name("Offset (m)");
  floorLineFolder.add(floorLineUniforms.uFloorLineGap, "value", 0, 2).name("Gap (m)");
  floorLineFolder
    .add(floorLineUniforms.uFloorLineThinThickness, "value", 0.01, 1)
    .name("Thin thickness (m)");
  floorLineFolder
    .add(floorLineUniforms.uFloorLineThickThickness, "value", 0.01, 1)
    .name("Thick thickness (m)");

  const floorLineColor = {
    ink: `#${floorLineUniforms.uFloorLineInkColor.value.getHexString()}`,
  };
  floorLineFolder
    .addColor(floorLineColor, "ink")
    .name("Ink color")
    .onChange((hex: string) => floorLineUniforms.uFloorLineInkColor.value.set(hex));

  // gui: vertical hatching (orientation-based shading strokes)
  const hatchingFolder = gui.addFolder("Facade hatching");

  hatchingFolder.add(hatchingUniforms.uHatchDensity, "value", 0, 6).name("Density (lines/m)");
  hatchingFolder.add(hatchingUniforms.uHatchThicknessMin, "value", 0, 1).name("Thickness (lit)");
  hatchingFolder.add(hatchingUniforms.uHatchThicknessMax, "value", 0, 1).name("Thickness (shadow)");
  hatchingFolder.add(hatchingUniforms.uHatchStrength, "value", 0, 1).name("Strength");

  const hatchingColor = {
    ink: `#${hatchingUniforms.uHatchInkColor.value.getHexString()}`,
  };
  hatchingFolder
    .addColor(hatchingColor, "ink")
    .name("Ink color")
    .onChange((hex: string) => hatchingUniforms.uHatchInkColor.value.set(hex));

  // gui: fake light direction (azimuth + elevation -> uLightDir). Drives the
  // orientation-based hatching; independent of the camera.
  const lightFolder = gui.addFolder("Sun direction (fake light)");

  lightFolder.add(lightParams, "azimuth", 0, 360, 1).name("Azimuth (deg)").onChange(updateLightDir);
  lightFolder
    .add(lightParams, "elevation", 0, 90, 1)
    .name("Elevation (deg)")
    .onChange(updateLightDir);
  lightFolder.add(lightArrow, "visible").name("Show arrow");

  return gui;
}
