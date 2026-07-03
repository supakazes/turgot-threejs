import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import { setupResize } from "./core/resize";
import { camera, frustumSize } from "./camera/camera";
import { renderer } from "./renderer/renderer";

// app
const app = document.getElementById("app")!;
app.appendChild(renderer.domElement);

// Controls
const controls = new MapControls(camera, renderer.domElement); // behaves like a map
controls.minZoom = 1; // Zoom limits
controls.maxZoom = 20;
controls.maxPolarAngle = Math.PI / 2; // Don't go below the ground:

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
  specificBuildings: undefined as THREE.Object3D | undefined,
  seine: undefined as THREE.Object3D | undefined,
};

const OBJECTS = {
  ALL_SHAPES: "all_shapes",
  FRAME: "planche-11-zone",
  SPECIFIC_BUILDINGS: "specific-buildings",
  SEINE: "la-seine",
  SMALL: "small",
};
loader.load("./models/buildings/scene.glb", (gltf) => {
  scene.add(gltf.scene);

  // Objects
  models.frame = gltf.scene.getObjectByName(OBJECTS.FRAME)!;
  models.seine = gltf.scene.getObjectByName(OBJECTS.SEINE)!;
  models.specificBuildings = gltf.scene.getObjectByName(OBJECTS.SPECIFIC_BUILDINGS)!;

  gltf.scene.traverse((obj) => {
    if (obj.name.startsWith(OBJECTS.ALL_SHAPES) || obj.name === OBJECTS.SMALL) {
      models.regularBuildings?.push(obj);
    }
  });

  if (models.frame) {
    models.frame.position.y = -1;
  }
});

// GUI
const gui = new GUI();
const params = {
  showMap: true,
  buildings: true,
};

gui
  .add(params, "showMap")
  .name("Map")
  .onChange((visible: boolean) => {
    if (models.frame) {
      models.frame.visible = visible;
    }
  });

gui
  .add(params, "buildings")
  .name("Buildings")
  .onChange((visible: boolean) => {
    models.regularBuildings?.forEach((obj) => {
      obj.visible = visible;
    });

    if (models.specificBuildings) {
      models.specificBuildings.visible = visible;
    }
    if (models.seine) {
      models.seine.visible = visible;
    }
  });

// Resize
setupResize(camera, renderer, app, frustumSize);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
