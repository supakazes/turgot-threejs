import * as THREE from "three";

// Overlay of hard edges (where faces meet above the angle threshold) so the
// building silhouette stays readable on top of the paper shader.
const EDGE_ANGLE = 30;
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

const lines: THREE.LineSegments[] = [];

// Walks an object tree and adds a black edge overlay to every mesh. The lines
// are parented to their mesh, so they inherit its transform automatically.
export function addEdges(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    const edges = new THREE.EdgesGeometry(obj.geometry, EDGE_ANGLE);
    const line = new THREE.LineSegments(edges, edgeMaterial);
    obj.add(line);
    lines.push(line);
  });
}

export function setEdgesVisible(visible: boolean) {
  lines.forEach((line) => (line.visible = visible));
}
