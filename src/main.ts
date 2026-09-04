import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { setupResize } from "./core/resize";
import { camera, FRUSTRUM_SIZE, initializeCamera } from "./camera/camera";
import { renderer } from "./renderer/renderer";
import { applyPaperShader } from "./shaders/applyPaperShader";

import { addEdges, setEdgesVisible } from "./scene/edges";
import * as paperRegistry from "./shaders/paper/registry";
import { lightUniforms } from "./shaders/facade/facadeUniforms";
import { createGui } from "./ui/gui";
import { createCompass } from "./ui/compass";

// app
const app = document.getElementById("app")!;
app.appendChild(renderer.domElement);

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
  elevationScale: 10,
};

// whole scene
const models = {
  floor: undefined as THREE.Object3D | undefined,
  regularBuildings: [] as THREE.Object3D[],
  placeDauphine: undefined as THREE.Object3D | undefined,
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
elevationTex.flipY = false; // match GLTFLoader convention (flipY=false, V=0=image top)

loader.load("./models/buildings/planche-11-zone.glb", (gltf) => {
  scene.add(gltf.scene);
  models.floor = gltf.scene.getObjectByName(OBJECTS.FLOOR)!;
  models.floor.position.y = -1;
  models.floor.visible = guiParams.showImageMap;

  models.floor.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const existing = child.material as THREE.MeshStandardMaterial;

    // Replace with a subdivided plane so displacementMap has enough vertices.
    child.geometry.computeBoundingBox();
    const lb = child.geometry.boundingBox!;
    const w = lb.max.x - lb.min.x;
    const d = lb.max.z - lb.min.z;
    const segs = Math.max(64, Math.ceil(Math.max(w, d) / 5));
    const subdivided = new THREE.PlaneGeometry(w, d, segs, segs);
    subdivided.rotateX(-Math.PI / 2);
    // rotateX flips V relative to the original GLB UV — restore it
    const uvAttr = subdivided.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uvAttr.count; i++) uvAttr.setY(i, 1 - uvAttr.getY(i));
    subdivided.translate((lb.min.x + lb.max.x) / 2, (lb.min.y + lb.max.y) / 2, (lb.min.z + lb.max.z) / 2);
    child.geometry = subdivided;

    const mat = new THREE.MeshStandardMaterial();
    if (existing.map) mat.map = existing.map;
    mat.displacementMap = elevationTex;
    mat.displacementScale = guiParams.elevationScale;
    mat.displacementBias = -guiParams.elevationScale;
    child.material = mat;
  });
});

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

createGui({ params: guiParams, models, setEdgesVisible, lightArrow, lightParams, updateLightDir });

// Resize
setupResize(camera, renderer, app, FRUSTRUM_SIZE);

// Render loop
const arrowForward = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);

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
animate();
