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
    return { a: 0, b: 0, c: 2.35, d: 0, e: 0, f: 48.85 }; // Default to central Paris
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
