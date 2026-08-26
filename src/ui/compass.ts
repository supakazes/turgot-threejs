import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";

const RESET_DURATION = 400;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function createCompass(
  controls: MapControls,
  camera: THREE.Camera,
  initialAzimuth: number,
  initialPolar: number
) {
  const container = document.createElement("div");
  container.id = "compass";
  container.innerHTML = `
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.9)" stroke="#ccc" stroke-width="1"/>
      <polygon points="24,7 28,24 24,21 20,24" fill="#c0392b"/>
      <polygon points="24,41 20,24 24,27 28,24" fill="#999"/>
      <circle cx="24" cy="24" r="2.5" fill="#555"/>
    </svg>
  `;
  document.body.appendChild(container);

  const svg = container.querySelector("svg")!;
  const offset = new THREE.Vector3();
  const spherical = new THREE.Spherical();

  let resetting = false;
  let resetStartAzimuth = 0;
  let resetStartPolar = 0;
  let resetStartTime = 0;

  container.addEventListener("click", () => {
    const currentAzimuth = controls.getAzimuthalAngle();
    const currentPolar = controls.getPolarAngle();

    let azDelta = initialAzimuth - currentAzimuth;
    while (azDelta > Math.PI) azDelta -= 2 * Math.PI;
    while (azDelta < -Math.PI) azDelta += 2 * Math.PI;

    const polDelta = initialPolar - currentPolar;
    if (Math.abs(azDelta) < 0.001 && Math.abs(polDelta) < 0.001) return;

    resetting = true;
    resetStartAzimuth = currentAzimuth;
    resetStartPolar = currentPolar;
    resetStartTime = performance.now();
  });

  function update() {
    if (resetting) {
      const elapsed = performance.now() - resetStartTime;
      const t = Math.min(elapsed / RESET_DURATION, 1);
      const ease = easeOutCubic(t);

      let azDelta = initialAzimuth - resetStartAzimuth;
      while (azDelta > Math.PI) azDelta -= 2 * Math.PI;
      while (azDelta < -Math.PI) azDelta += 2 * Math.PI;

      offset.copy(camera.position).sub(controls.target);
      spherical.setFromVector3(offset);
      spherical.theta = resetStartAzimuth + azDelta * ease;
      spherical.phi = resetStartPolar + (initialPolar - resetStartPolar) * ease;
      spherical.makeSafe();
      offset.setFromSpherical(spherical);
      camera.position.copy(controls.target).add(offset);
      controls.update();

      if (t >= 1) resetting = false;
    }

    const deg = THREE.MathUtils.radToDeg(-(controls.getAzimuthalAngle() - initialAzimuth));
    svg.style.transform = `rotate(${deg}deg)`;
  }

  return { update };
}
