import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const documentApp = document.querySelector("#app");

// Create scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation to top-down view
renderer.setSize(window.innerWidth, window.innerHeight);
documentApp?.appendChild(renderer.domElement);

// Load texture for the floor
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load("src/assets/images/plan-dassemblage.jpg");
floorTexture.wrapS = THREE.ClampToEdgeWrapping;
floorTexture.wrapT = THREE.ClampToEdgeWrapping;
floorTexture.minFilter = THREE.LinearFilter;

// Plane dimensions (keep proportions)
const planeWidth = 6480; // scale down for scene units
const planeHeight = 6710;
const floorGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Make it horizontal (floor)
scene.add(floor);

// scene helper (arrow)
const dir = new THREE.Vector3(0, 1, 0);
dir.normalize();
const origin = new THREE.Vector3(0, 0, 0);
const length = 1;
const hex = 0xffff00;
const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
scene.add(arrowHelper);

// Position camera above the floor, looking down
camera.position.set(0, 5500, 0);
camera.lookAt(0, 0, 0);
controls.update();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}
animate();
