import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";

export const FRUSTRUM_SIZE = 1000;

export const camera = new THREE.OrthographicCamera(
  -FRUSTRUM_SIZE / 2,
  FRUSTRUM_SIZE / 2,
  FRUSTRUM_SIZE / 2,
  -FRUSTRUM_SIZE / 2,
  0.1,
  10000,
);

// Camera settings
const CAMERA_ANGLE = 48; // degrees
const CAMERA_HEIGHT = 450;
const CAMERA_Z = CAMERA_HEIGHT / Math.tan(THREE.MathUtils.degToRad(CAMERA_ANGLE));
const CAMERA_OFFSET = new THREE.Vector3(0, CAMERA_HEIGHT, CAMERA_Z);

// place dauphine
const INITIAL_TARGET = new THREE.Vector3(-483.5906495115238, 0, 316.484266094362);

const INITIAL_ZOOM = 10;

// initialization
export function initializeCamera(controls: MapControls) {
  controls.target.copy(INITIAL_TARGET);

  camera.position.copy(INITIAL_TARGET).add(CAMERA_OFFSET);
  camera.zoom = INITIAL_ZOOM;

  camera.updateProjectionMatrix();
  controls.update();
}
