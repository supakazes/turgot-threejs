// Place Dauphine arcade door: an arch-topped opening specific to this building.
//
// Composed from reusable SDF primitives (see sdf.glsl) so the pieces can be
// reused elsewhere. All coordinates are in meters, in a local frame whose
// origin sits at the horizontal center of the door, on the ground (y up).
//
//   arch ring (semicircle outline)  <- reads as the opening's arch
//     + tympanum square              <- small block inside the arch
//   door leaf (filled rectangle)     <- the solid dark mass
//   base sill (wider short rectangle) <- stepped foot
//   pilaster (thin vertical rect)     <- pier to the right of each bay

uniform float uDoorPitch;          // horizontal spacing between doors (m)
uniform float uDoorWidth;          // width of the door leaf (m)
uniform float uDoorBodyHeight;     // height of the leaf up to the arch spring (m)
uniform float uDoorArchRadius;     // arch half-width / spring radius (m)
uniform float uDoorArchHeight;     // arch rise: how tall the semicircle stands (m)
uniform float uDoorFrameThickness; // thickness of the arch ring (m)
uniform float uDoorSquareSize;     // tympanum square side (m)
uniform float uDoorPilasterWidth;  // width of the right-hand pilaster (m)
uniform vec2  uDoorCutSize;        // transparent notch (width, height) in the leaf (m)
uniform float uDoorCutSide;        // which side the notch sits on: -1 left, +1 right
uniform vec3  uDoorInkColor;

// Signed distance to the composed door silhouette, in local meters.
float placeDauphineDoorDist(vec2 p)
{
    // Solid door leaf.
    float leaf = sdBox(p - vec2(0.0, uDoorBodyHeight * 0.5),
                       vec2(uDoorWidth * 0.5, uDoorBodyHeight * 0.5));

    // Transparent rectangular notch carved out of the leaf, offset to one side.
    float cutX = uDoorCutSide * (uDoorWidth * 0.5 - uDoorCutSize.x * 0.5) -0.1;
    float cutY = uDoorCutSize.y * 0.5;
    float cut = sdBox(p - vec2(cutX, cutY), uDoorCutSize * 0.5);
    leaf = max(leaf, -cut); // subtract the notch

    // Base sill: wider and short, stepped out beneath the leaf.
    float baseH = uDoorBodyHeight * 0.12;
    float base = sdBox(p - vec2(0.0, baseH * 0.5),
                       vec2(uDoorWidth * 0.72, baseH * 0.5));

    // Arch ring sitting on top of the leaf. An ellipse (half-width =
    // uDoorArchRadius, rise = uDoorArchHeight) so its height is independent of
    // its width. Squash y into circle space, measure there, then unsquash the
    // distance back to world meters so the ring thickness stays even.
    vec2 archP = p - vec2(0.0, uDoorBodyHeight); // relative to the arch spring
    float squash = uDoorArchRadius / max(uDoorArchHeight, 1e-4);
    vec2 archC = vec2(archP.x, archP.y * squash);
    float outer = sdCircle(archC, uDoorArchRadius) / squash;
    float inner = sdCircle(archC, uDoorArchRadius - uDoorFrameThickness) / squash;
    float ring = max(outer, -inner);
    float arch = max(ring, -archP.y); // keep the upper half only

    // Tympanum square centered inside the arch opening.
    float squareY = uDoorBodyHeight + uDoorArchHeight * 0.45;
    float square = sdBox(p - vec2(0.0, squareY),
                         vec2(uDoorSquareSize * 0.5));

    // Pilaster: thin full-height pier to the right of the bay.
    float pilasterX = uDoorWidth * 0.5 + uDoorPilasterWidth;
    float pilasterH = uDoorBodyHeight -1.5;
    float pilaster = sdBox(p - vec2(pilasterX, pilasterH * 0.5),
                           vec2(uDoorPilasterWidth * 0.5, pilasterH * 0.5));

    // Union of every filled piece.
    float d = leaf;
    d = min(d, base);
    d = min(d, arch);
    d = min(d, square);
    d = min(d, pilaster);
    return d;
}

// Engrave the tiled door arcade onto `base` across the ground zone.
// `along`/`height` are meters along the wall run and above the ground.
vec3 placeDauphineDoors(vec3 base, float along, float height)
{
    if (height < 0.0) {
        return base;
    }

    // One door per bay, centered in its pitch cell.
    float localX = (fract(along / uDoorPitch) - 0.5) * uDoorPitch;
    vec2 p = vec2(localX, height);

    float d = placeDauphineDoorDist(p);

    // AA width from the continuous metric coords so it stays stable across the
    // bay seams (fwidth on the fract-wrapped coord would spike there).
    float aa = clamp(max(fwidth(along), fwidth(height)), 1e-4, 0.05);
    float ink = 1.0 - smoothstep(-aa, aa, d);

    return mix(base, uDoorInkColor, ink);
}
