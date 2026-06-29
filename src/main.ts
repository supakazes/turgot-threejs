import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";

const gui = new GUI();

const app = document.getElementById("app")!;

// Scene
const scene = new THREE.Scene();

// Camera
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 1000;

const camera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  10000,
);

camera.position.set(0, 450, 500);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setClearColor("#fdf6e1", 1);
app.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Pan by default
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = false;

controls.screenSpacePanning = true;
controls.zoomSpeed = 1.2;
controls.panSpeed = 1.2;

// Zoom limits
controls.minZoom = 0.2;
controls.maxZoom = 20;

// Initial target
controls.target.set(0, 0, 0);
controls.update();

// Rotate only while Ctrl/Cmd is pressed
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    controls.enableRotate = true;
  }
});

window.addEventListener("keyup", () => {
  controls.enableRotate = false;
});

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
let model: THREE.Group;
let frame: THREE.Object3D | undefined = undefined;
let regularBuildings: THREE.Object3D[] = [];

let specificBuildings: THREE.Object3D;
let seine: THREE.Object3D;

loader.load("./models/buildings/scene.glb", (gltf) => {
  console.log("GLTF loaded:", gltf);

  scene.add(gltf.scene);

  // Objects
  frame = gltf.scene.getObjectByName("planche-11-zone")!;
  seine = gltf.scene.getObjectByName("la-seine")!;
  specificBuildings = gltf.scene.getObjectByName("specific-buildings")!;

  gltf.scene.traverse((obj) => {
    console.log("Object:", obj.name);
    if (obj.name.startsWith("all_shapes") || obj.name === "small") {
      regularBuildings.push(obj);
    }
  });

  if (frame) {
    frame.position.y = -1;
  }
});

// GUI
const params = {
  showMap: true,
  buildings: true,
};

gui
  .add(params, "showMap")
  .name("Map")
  .onChange((visible: boolean) => {
    if (frame) {
      frame.visible = visible;
    }
  });

gui
  .add(params, "buildings")
  .name("Buildings")
  .onChange((visible: boolean) => {
    regularBuildings.forEach((obj) => {
      obj.visible = visible;
    });

    specificBuildings.visible = visible;
    seine.visible = visible;
  });

// Resize
function onResize() {
  const width = app.clientWidth;
  const height = app.clientHeight;
  const aspect = width / height;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", onResize);
onResize();

// Render loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
