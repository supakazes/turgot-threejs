import * as THREE from "three/webgpu";
import { uniform } from "three/tsl";

const PAPER_SCALE = 0.08;

export const paperUniforms = {
  uPaperBaseColor: uniform(new THREE.Color("#fffef6")),
  uStain1Scale: uniform(8.1635),
  uStain1Strength: uniform(0.1401),
  uStain2Scale: uniform(1.9),
  uStain2Strength: uniform(0.04),
  uWarpStrength: uniform(0.294),
  uSpeck1Scale: uniform(2.94),
  uSpeck1Density: uniform(0.565),
  uSpeck1Size: uniform(0.08992),
  uSpeck1Strength: uniform(0.553),
  uSpeck2Scale: uniform(1.22),
  uSpeck2Density: uniform(0.38),
  uSpeck2Size: uniform(0.08042),
  uSpeck2Strength: uniform(0.245),
};

export const uPaperScale = uniform(PAPER_SCALE);
export const uPaperMatrix = uniform(new THREE.Matrix4());
