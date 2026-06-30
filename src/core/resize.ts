import * as THREE from "three";

function onResize(
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  app: HTMLElement,
  frustumSize: number,
) {
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

// resize.ts
export function setupResize(
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  app: HTMLElement,
  frustumSize: number,
) {
  const resize = () => {
    onResize(camera, renderer, app, frustumSize);
  };

  window.addEventListener("resize", resize);
  resize();
}
