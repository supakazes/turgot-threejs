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

// app
const app = document.getElementById("app")!;
app.appendChild(renderer.domElement);

// Controls
const controls = new MapControls(camera, renderer.domElement); // behaves like a map
controls.minZoom = 1; // Zoom limits
controls.maxZoom = 20;
controls.maxPolarAngle = Math.PI / 2; // Don't go below the ground:

// camera initialization
initializeCamera(controls);

// Scene
const scene = new THREE.Scene();

// Ambient light
scene.add(new THREE.AmbientLight(0xffffff, 2));

// Directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(100, 200, 100);
scene.add(dirLight);

// Helpers
scene.add(new THREE.AxesHelper(100));
scene.add(new THREE.GridHelper(3000, 100));

// GLB loader
const loader = new GLTFLoader();

// whole scene
const models = {
  frame: undefined as THREE.Object3D | undefined,
  regularBuildings: [] as THREE.Object3D[],
  placeDauphine: undefined as THREE.Object3D | undefined,
};

const OBJECTS = {
  ALL_SHAPES: "all_shapes",
  FRAME: "planche-11-zone",
  PLACE_DAUPHINE: "place_dauphine",
  SMALL: "small",
};

// Place Dauphine
loader.load("./models/buildings/specific-buildings/place-dauphine.glb", (gltf) => {
  scene.add(gltf.scene);
  models.placeDauphine = gltf.scene.getObjectByName(OBJECTS.PLACE_DAUPHINE)!;

  applyPaperShader(models.placeDauphine, true);
  addEdges(models.placeDauphine);
  setEdgesVisible(params.showEdges);
});

// Frame (Turgot map image)
loader.load("./models/buildings/planche-11-zone.glb", (gltf) => {
  scene.add(gltf.scene);
  models.frame = gltf.scene.getObjectByName(OBJECTS.FRAME)!;
  models.frame.position.y = -1;
  models.frame.visible = false;
});

// Regular buildings
loader.load("./models/buildings/scene.glb", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((obj) => {
    if (obj.name.startsWith(OBJECTS.ALL_SHAPES) || obj.name === OBJECTS.SMALL) {
      models.regularBuildings?.push(obj);
      applyPaperShader(obj);
      addEdges(obj);
    }
  });
  setEdgesVisible(params.showEdges);
});

// GUI state
const params = {
  showMap: false,
  buildings: true,
  showEdges: true,
};

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
scene.add(lightArrow);

createGui({ params, models, setEdgesVisible, lightArrow, lightParams, updateLightDir });

// Resize
setupResize(camera, renderer, app, FRUSTRUM_SIZE);

// Render loop
const arrowForward = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);

  controls.update();

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
