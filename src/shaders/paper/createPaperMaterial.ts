import { MeshBasicNodeMaterial, type Node } from "three/webgpu";
import {
  Fn,
  varying,
  vec2,
  vec3,
  vec4,
  float,
  positionWorld,
  normalWorld,
  uv,
  attribute,
  normalize,
  cross,
  dot,
} from "three/tsl";
import { paperColorFn } from "./tsl/paperFunctions";
import { applyImperfectionsFn } from "./tsl/imperfectionsFunctions";
import { uPaperScale, uPaperMatrix } from "./paperUniforms";

// Vertex-stage varyings shared by all paper materials
const vWorldPosition = varying(positionWorld);
const vWorldNormal = varying(normalWorld);
const vWallUV = varying(uv());
const vWallSize = varying(attribute("aWallSize", "vec2"));
const vFacadeMetric = varying(
  Fn(() => {
    const worldNorm = normalWorld;
    const up = vec3(0, 1, 0);
    const tangent = normalize(cross(worldNorm, up).add(float(1e-5)));
    return vec2(dot(positionWorld, tangent), positionWorld.y);
  })(),
);

type SurfaceLayersFn = (
  base: any,
  uvCoord: any,
  wallUV: any,
  wallSize: any,
  metric: any,
  hasWallData: any,
  worldNormal: any,
) => any;

export function createPaperMaterial(surfaceLayersFn: SurfaceLayersFn): MeshBasicNodeMaterial {
  const material = new MeshBasicNodeMaterial();

  material.colorNode = Fn(() => {
    const paperPos = uPaperMatrix.mul(vec4(vWorldPosition, 1.0)).xyz;
    const paperUV = paperPos.xy.mul(uPaperScale);
    const base = paperColorFn(paperUV);
    const vWallSizeVec = vWallSize as unknown as Node<"vec2">;
    const hasWallData = dot(vWallSizeVec, vWallSizeVec).greaterThan(0.0);
    const worldNorm = normalize(vWorldNormal);
    const color = surfaceLayersFn(
      base,
      paperUV,
      vWallUV,
      vWallSize,
      vFacadeMetric,
      hasWallData,
      worldNorm,
    );
    return vec4(applyImperfectionsFn(color, base, paperUV), 1.0);
  })();

  return material;
}
