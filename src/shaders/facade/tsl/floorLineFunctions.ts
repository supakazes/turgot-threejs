import { Fn, float, abs, floor, min, mix, smoothstep, clamp, fwidth, select } from "three/tsl";
import type { Node } from "three/webgpu";
import { floorLineUniforms } from "../facadeUniforms";

export const facadeFloorLinesFn = Fn(
  ([col_in, height, groundHeight, floorHeight, floorCount]: [
    Node<"color">,
    Node<"float">,
    Node<"float">,
    Node<"float">,
    Node<"float">,
  ]) => {
    const {
      uFloorLineOffset,
      uFloorLineGap,
      uFloorLineThinThickness,
      uFloorLineThickThickness,
      uFloorLineInkColor,
    } = floorLineUniforms;

    const rowSpan = height.sub(groundHeight);
    const n = floor(rowSpan.div(floorHeight).add(0.5));
    const outOfRange = n.lessThan(0.0).or(n.greaterThan(floorCount.sub(1.0)));

    const boundary = groundHeight.add(n.mul(floorHeight));
    const center = boundary.add(uFloorLineOffset);
    const thickD = abs(height.sub(center.sub(uFloorLineGap.mul(0.5)))).sub(
      uFloorLineThickThickness.mul(0.5),
    );
    const thinD = abs(height.sub(center.add(uFloorLineGap.mul(0.5)))).sub(
      uFloorLineThinThickness.mul(0.5),
    );
    const d = min(thickD, thinD);

    const aa = clamp(fwidth(height), float(1e-4), float(0.05));
    const ink = float(1).sub(smoothstep(aa.negate(), aa, d));

    return select(outOfRange, col_in, mix(col_in, uFloorLineInkColor, ink));
  },
);
