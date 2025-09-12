import * as math from "mathjs";
import { cornersGeoCoordinates, cornersLocalCoordinates } from "../constants/cornersCoordinates";

export function solveAffine(
  srcPoints: { x: number; y: number }[],
  dstPoints: { lng: number; lat: number }[]
): { a: number; b: number; c: number; d: number; e: number; f: number } {
  if (srcPoints.length < 3) throw new Error("required 3 points");

  const A: number[][] = [];
  const B: number[] = [];

  // Use exactly 3 points for a determined system
  for (let i = 0; i < 3; i++) {
    const { x, y } = srcPoints[i];
    const { lng, lat } = dstPoints[i];

    A.push([x, y, 1, 0, 0, 0]);
    A.push([0, 0, 0, x, y, 1]);
    B.push(lng);
    B.push(lat);
  }

  try {
    // Solve the linear system
    const mResult = math.lusolve(math.matrix(A), math.matrix(B));
    const m = mResult.valueOf() as number[];

    // Ensure all coefficients are valid numbers
    const coefficients = {
      a: Number(m[0]) || 0,
      b: Number(m[1]) || 0,
      c: Number(m[2]) || 0,
      d: Number(m[3]) || 0,
      e: Number(m[4]) || 0,
      f: Number(m[5]) || 0,
    };

    return coefficients;
  } catch (error) {
    console.error("Error solving affine transformation:", error);

    // Return default coefficients as a fallback
    return { a: 0.0001, b: 0.0001, c: 2.35, d: 0.0001, e: 0.0001, f: 48.85 };
  }
}

// Initialize our affine transformation by mapping the first three corners
// We're mapping from the local coordinate system (where y in cornersLocalCoordinates
// is actually used as z in Three.js) to geographical coordinates
const affine = solveAffine(
  cornersLocalCoordinates.slice(0, 3).map((point) => ({ x: point.x, y: point.y })),
  cornersGeoCoordinates.slice(0, 3)
);

export function localToLngLat(x: number, y: number) {
  const { a, b, c, d, e, f } = affine;
  const lng = a * x + b * y + c;
  const lat = d * x + e * y + f;

  // Make sure values are numeric
  const numLng = Number(lng);
  const numLat = Number(lat);

  return { lng: numLng, lat: numLat };
}

// Function to find the barycentric coordinates of a point within a triangle
function getBarycentricCoordinates(
  point: { lng: number; lat: number },
  triangle: { lng: number; lat: number }[]
): { alpha: number; beta: number; gamma: number } {
  const [p1, p2, p3] = triangle;

  // Calculate vectors
  const v0 = { lng: p3.lng - p1.lng, lat: p3.lat - p1.lat };
  const v1 = { lng: p2.lng - p1.lng, lat: p2.lat - p1.lat };
  const v2 = { lng: point.lng - p1.lng, lat: point.lat - p1.lat };

  // Calculate dot products
  const dot00 = v0.lng * v0.lng + v0.lat * v0.lat;
  const dot01 = v0.lng * v1.lng + v0.lat * v1.lat;
  const dot02 = v0.lng * v2.lng + v0.lat * v2.lat;
  const dot11 = v1.lng * v1.lng + v1.lat * v1.lat;
  const dot12 = v1.lng * v2.lng + v1.lat * v2.lat;

  // Calculate barycentric coordinates
  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  // Return alpha, beta, gamma
  return {
    alpha: 1 - u - v, // alpha for p1
    beta: v, // beta for p2
    gamma: u, // gamma for p3
  };
}

export function lngLatToLocal(lng: number, lat: number) {
  console.log("lngLatToLocal input:", { lng, lat });

  // We'll use the first triangle from our corners
  const geoTriangle = cornersGeoCoordinates.slice(0, 3);
  const localTriangle = cornersLocalCoordinates.slice(0, 3);

  // Get the barycentric coordinates of the point within the geo triangle
  const { alpha, beta, gamma } = getBarycentricCoordinates({ lng, lat }, geoTriangle);

  console.log("Barycentric coordinates:", { alpha, beta, gamma });

  // Use the same barycentric coordinates to find the point in the local triangle
  const x = alpha * localTriangle[0].x + beta * localTriangle[1].x + gamma * localTriangle[2].x;
  const y = alpha * localTriangle[0].y + beta * localTriangle[1].y + gamma * localTriangle[2].y;

  // Make sure values are numeric
  const numX = Number(x);
  const numY = Number(y);

  console.log("lngLatToLocal result:", { x: numX, y: numY });

  return { x: numX, y: numY };
}
