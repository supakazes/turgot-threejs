import * as THREE from "three";

// Add corner point helpers
function addCornerPoint(x, z, color) {
  const geometry = new THREE.SphereGeometry(50, 16, 16); // Size of 50 units
  const material = new THREE.MeshBasicMaterial({ color });
  const point = new THREE.Mesh(geometry, material);
  point.position.set(x, 0, z); // y = 0 for floor level

  return point;
}

export default addCornerPoint;
