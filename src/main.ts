import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import { setupResize } from "./core/resize";
import { camera, FRUSTRUM_SIZE, initializeCamera } from "./camera/camera";
import { renderer } from "./renderer/renderer";

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
});

// Frame (Turgot map image)
loader.load("./models/buildings/planche-11-zone.glb", (gltf) => {
  scene.add(gltf.scene);
  models.frame = gltf.scene.getObjectByName(OBJECTS.FRAME)!;
  models.frame.position.y = -1;
});

// Regular buildings
loader.load("./models/buildings/scene.glb", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((obj) => {
    if (obj.name.startsWith(OBJECTS.ALL_SHAPES) || obj.name === OBJECTS.SMALL) {
      models.regularBuildings?.push(obj);
    }
  });
});

// GUI
const gui = new GUI();
const params = {
  showMap: true,
  buildings: true,
};

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

// Resize
setupResize(camera, renderer, app, FRUSTRUM_SIZE);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
