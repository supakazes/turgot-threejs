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
  (-frustumSize * aspect) / 2, // left
  (frustumSize * aspect) / 2, // right
  frustumSize / 2, // top
  -frustumSize / 2, // bottom
  0.1, // near
  10000, // far
);
camera.position.set(0, 500, 500);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#fdf6e1", 1);
// renderer.outputColorSpace = THREE.SRGBColorSpace;
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

const allModels = new THREE.Group();
scene.add(allModels);

// regular buildings
loader.load("./models/buildings/buildings.glb", (gltf) => {
  allModels.add(gltf.scene);
});

// specific buildings
loader.load("./models/buildings/specific-buildings.glb", (gltf) => {
  allModels.add(gltf.scene);
});

// la seine
loader.load("./models/buildings/la-seine.glb", (gltf) => {
  allModels.add(gltf.scene);
});

// map frame
const texture = new THREE.TextureLoader().load("./images/sheet_11.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
const frameMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 1,
});

const frame = new THREE.Mesh(new THREE.PlaneGeometry(1823, 1723), frameMaterial);
frame.rotation.x = -Math.PI / 2;
frame.position.set(1.84, -1, -8.36);
scene.add(frame);

// GUI
const params = {
  "map plane": 1,
  visible: true,
};
gui.add(params, "map plane", 0, 1, 0.01).onChange((value) => {
  frame.material.opacity = value;
});
gui
  .add(params, "visible")
  .name("3D Buildings")
  .onChange((value) => {
    allModels.visible = value;
  });

// Resize
function onResize() {
  // Camera
  const width = app.clientWidth;
  const height = app.clientHeight;
  const aspect = width / height;
  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();

  // Renderer
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
}

// On Resize
window.addEventListener("resize", onResize);
onResize();

// Render loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}
animate();
