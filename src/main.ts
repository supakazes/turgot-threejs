import * as THREE from "three/webgpu";
import { MapControls } from "three/addons/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { setupResize } from "./core/resize";
import { camera, FRUSTRUM_SIZE, initializeCamera } from "./camera/camera";
import { applyPaperShader } from "./shaders/applyPaperShader";

import { addEdges, setEdgesVisible } from "./scene/edges";
import * as paperRegistry from "./shaders/paper/registry";
import { lightUniforms } from "./shaders/facade/facadeUniforms";
import { createGui } from "./ui/gui";
import { createCompass } from "./ui/compass";
import { MeshStandardNodeMaterial } from "three/webgpu";
import { positionLocal, texture, uv, vec3 } from "three/tsl";

// canvas
const canvasContainer = document.getElementById("canvas-container")! as HTMLDivElement;
const canvas = document.querySelector("canvas")! as HTMLCanvasElement;
export const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, alpha: true });

renderer.debug.checkShaderErrors = true;
renderer.setClearColor("#000000", 0);
// WebGPU canvas uses bgra8unorm-srgb (hardware sRGB), so the renderer must NOT
// apply a second linearToSRGB conversion in its own pipeline — LinearSRGBColorSpace
// skips that pass and lets the canvas format handle it.
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Controls
const controls = new MapControls(camera, renderer.domElement); // behaves like a map
controls.minZoom = 0; // Zoom limits
controls.maxZoom = 20;
controls.maxPolarAngle = Math.PI / 2; // Don't go below the ground:

// camera initialization
initializeCamera(controls);
const initialAzimuth = controls.getAzimuthalAngle();
const initialPolar = controls.getPolarAngle();
const compass = createCompass(controls, camera, initialAzimuth, initialPolar);

// Scene
const scene = new THREE.Scene();

// Ambient light
scene.add(new THREE.AmbientLight(0xffffff, 2));

// Directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(100, 200, 100);
scene.add(dirLight);

// Helpers
// scene.add(new THREE.AxesHelper(100));
// scene.add(new THREE.GridHelper(3000, 100));

// GLB loader
const loader = new GLTFLoader();

// GUI state
const guiParams = {
  showImageMap: true,
  buildings: true,
  showEdges: true,
  elevationScale: 20,
};

// whole scene
const models = {
  floor: undefined as THREE.Object3D | undefined,
  regularBuildings: [] as THREE.Object3D[],
  placeDauphine: undefined as THREE.Object3D | undefined,
  laSeine: undefined as THREE.Object3D | undefined,
};

const OBJECTS = {
  ALL_SHAPES: "all_shapes",
  FLOOR: "planche-11-zone",
  PLACE_DAUPHINE: "place_dauphine",
  SMALL: "small",
};

// Place Dauphine
loader.load("./models/buildings/specific-buildings/place-dauphine.glb", (gltf) => {
  scene.add(gltf.scene);
  models.placeDauphine = gltf.scene.getObjectByName(OBJECTS.PLACE_DAUPHINE)!;

  applyPaperShader(models.placeDauphine, true);
  addEdges(models.placeDauphine);
  setEdgesVisible(guiParams.showEdges);
});

// Turgot image map

const elevationTex = new THREE.TextureLoader().load("./images/elevation-data.png");

elevationTex.flipY = false;
elevationTex.colorSpace = THREE.NoColorSpace;

elevationTex.generateMipmaps = true;
elevationTex.minFilter = THREE.LinearMipmapLinearFilter;
elevationTex.magFilter = THREE.LinearFilter;

elevationTex.wrapS = THREE.ClampToEdgeWrapping;
elevationTex.wrapT = THREE.ClampToEdgeWrapping;

loader.load("./models/buildings/planche-11-zone.glb", (gltf) => {
  scene.add(gltf.scene);

  models.floor = gltf.scene.getObjectByName(OBJECTS.FLOOR)!;

  models.floor.position.y = -1;
  models.floor.visible = guiParams.showImageMap;

  models.floor.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const existingMat = child.material as THREE.MeshStandardMaterial;

    // -------------------------------------------------------------------------
    // Original floor bounds
    // -------------------------------------------------------------------------

    child.geometry.computeBoundingBox();

    const lb = child.geometry.boundingBox!;

    const w = lb.max.x - lb.min.x;
    const d = lb.max.z - lb.min.z;

    // -------------------------------------------------------------------------
    // Moderate geometry density
    // -------------------------------------------------------------------------

    const texWidth = elevationTex.image.width;
    const texHeight = elevationTex.image.height;

    const texelStep = 4;

    const segsX = Math.max(64, Math.round((texWidth - 1) / texelStep));

    const segsZ = Math.max(64, Math.round((texHeight - 1) / texelStep));

    // -------------------------------------------------------------------------
    // Subdivided floor
    // -------------------------------------------------------------------------

    const subdivided = new THREE.PlaneGeometry(w, d, segsX, segsZ);

    subdivided.rotateX(-Math.PI / 2);

    const uvAttr = subdivided.attributes.uv as THREE.BufferAttribute;

    for (let i = 0; i < uvAttr.count; i++) {
      uvAttr.setY(i, 1 - uvAttr.getY(i));
    }

    subdivided.translate(
      (lb.min.x + lb.max.x) / 2,
      (lb.min.y + lb.max.y) / 2,
      (lb.min.z + lb.max.z) / 2,
    );

    // -------------------------------------------------------------------------
    // Node material
    //
    // Explicit mip level 2 gives the displacement a prefiltered elevation
    // signal instead of sampling the full-resolution 1277 × 1214 data.
    // -------------------------------------------------------------------------

    const mat = new MeshStandardNodeMaterial();

    mat.color.copy(existingMat.color);
    mat.roughness = existingMat.roughness;
    mat.metalness = existingMat.metalness;

    if (existingMat.map) {
      mat.colorNode = texture(existingMat.map, uv());
    }

    const height = texture(elevationTex, uv(), 2).r;

    const displacement = height.mul(guiParams.elevationScale).sub(guiParams.elevationScale);

    mat.positionNode = positionLocal.add(vec3(0, displacement, 0));

    // -------------------------------------------------------------------------
    // Replace floor
    // -------------------------------------------------------------------------

    child.geometry.dispose();
    child.geometry = subdivided;
    child.material = mat;
  });
});

// la seine

// Regular buildings
loader.load("./models/buildings/scene.glb", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((obj) => {
    if (obj.name.startsWith(OBJECTS.ALL_SHAPES) || obj.name === OBJECTS.SMALL) {
      models.regularBuildings?.push(obj);
      applyPaperShader(obj);
      addEdges(obj);
      return;
    }
  });
  setEdgesVisible(guiParams.showEdges);
});

// Fake light direction (azimuth + elevation -> uLightDir). Drives the
// orientation-based hatching; independent of the camera.
const lightParams = { azimuth: 58, elevation: 20 };
function updateLightDir() {
  const az = THREE.MathUtils.degToRad(lightParams.azimuth);
  const el = THREE.MathUtils.degToRad(lightParams.elevation);
  const cosEl = Math.cos(el);
  lightUniforms.uLightDir.value
    .set(Math.sin(az) * cosEl, Math.sin(el), Math.cos(az) * cosEl)
    .normalize();
}
updateLightDir();

// Debug arrow for the fake light direction. It carries no scene position of its
// own (the light is directional), so each frame we park it in front of the
// camera and point it toward the light. Arrow points along uLightDir (toward
// the light source).
const lightArrow = new THREE.ArrowHelper(
  lightUniforms.uLightDir.value,
  new THREE.Vector3(),
  120,
  0xffaa00,
  40,
  24,
);
lightArrow.visible = false;
scene.add(lightArrow);

createGui({
  renderer,
  params: guiParams,
  models,
  setEdgesVisible,
  lightArrow,
  lightParams,
  updateLightDir,
});

// Resize
setupResize(camera, renderer, canvasContainer, FRUSTRUM_SIZE);

const arrowForward = new THREE.Vector3();

// Render loop
const timer = new THREE.Timer();
timer.connect(document);

function tick() {
  timer.update();
  controls.update();
  compass.update();
  paperRegistry.update(camera);

  // Keep the light arrow in front of the camera, pointing toward the light.
  if (lightArrow.visible) {
    camera.getWorldDirection(arrowForward);
    lightArrow.position.copy(camera.position).addScaledVector(arrowForward, 400);
    lightArrow.setDirection(lightUniforms.uLightDir.value);
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(tick);
