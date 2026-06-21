import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const app = document.getElementById("app")!;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
camera.position.set(0, 200, 300);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#fdf6e1", 1);
app.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Ambien light
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

// regular buildings
loader.load("./models/buildings/buildings.glb", (gltf) => {
  scene.add(gltf.scene);
});

// specific buildings
loader.load("./models/buildings/specific-buildings.glb", (gltf) => {
  scene.add(gltf.scene);
});

// la seine
loader.load("./models/buildings/la-seine.glb", (gltf) => {
  scene.add(gltf.scene);
});

// frame
loader.load("./models/buildings/frame.glb", (gltf) => {
  scene.add(gltf.scene);
});

// Resize
function onResize() {
  const width = app.clientWidth;
  const height = app.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
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
