import * as THREE from "three";

// Renderer
export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor("#000000", 1);
