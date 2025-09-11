import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { halfHeight, halfWidth, planeHeight, planeWidth } from "./constants/floor";
import getCoordinatesFromPlanePosition from "./utils/getCoordinatesFromPlanePosition";
import addCornerPoint from "./utils/addCornerPoint";

const documentApp = document.querySelector("#app");

// World setup
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

// Create corner points with different colors
scene.add(addCornerPoint(-halfWidth, -halfHeight, 0xff0000));
scene.add(addCornerPoint(halfWidth, -halfHeight, 0x00ff00));
scene.add(addCornerPoint(halfWidth, halfHeight, 0x0000ff));
scene.add(addCornerPoint(-halfWidth, halfHeight, 0xffff00));
scene.add(addCornerPoint(0, 0, 0x000000));

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

// Raycasting setup for clicking on the plane
const raycaster = new THREE.Raycaster();
const cursor = new THREE.Vector2();

// Add event listener for mouse clicks
window.addEventListener("click", (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
  cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(cursor, camera);

  // Calculate objects intersecting the raycaster
  const intersects = raycaster.intersectObject(floor);

  // If the floor was clicked
  if (intersects.length > 0) {
    const point = intersects[0].point;
    const [longitude, latitude] = getCoordinatesFromPlanePosition(point.x, point.z);
    console.log(`Clicked at position (${point.x.toFixed(2)}, ${point.z.toFixed(2)})`);
    console.log(`Longitude: ${longitude.toFixed(7)}, Latitude: ${latitude.toFixed(7)}`);
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}
animate();
