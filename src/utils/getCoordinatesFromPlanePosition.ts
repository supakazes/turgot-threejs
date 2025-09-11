import { halfHeight, halfWidth, planeHeight, planeWidth } from "../constants/floor";
import mapLngLatRef from "../constants/mapLngLatRef";

// Function to convert Three.js coordinates to longitude and latitude
function getCoordinatesFromPlanePosition(x: number, z: number): [number, number] {
  // Normalize the x and z positions (convert from absolute coordinates to 0-1 range)
  const normalizedX = (x + halfWidth) / planeWidth; // Converting from -halfWidth..halfWidth to 0..1
  const normalizedZ = (z + halfHeight) / planeHeight; // Converting from -halfHeight..halfHeight to 0..1

  // Interpolate longitude (longitude decreases as x increases)
  const longitude =
    mapLngLatRef.topLeft.lng -
    normalizedX * (mapLngLatRef.topLeft.lng - mapLngLatRef.bottomRight.lng);

  // Interpolate latitude (latitude increases as z increases)
  const latitude =
    mapLngLatRef.topLeft.lat +
    normalizedZ * (mapLngLatRef.bottomRight.lat - mapLngLatRef.topLeft.lat);

  return [longitude, latitude];
}

export default getCoordinatesFromPlanePosition;
