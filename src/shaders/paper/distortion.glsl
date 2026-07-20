// Shared domain-warp helper — the reusable way to rough up shape outlines.
//
// Unlike imperfections.glsl (which runs AFTER shapes, on color), this runs
// BEFORE a surface samples its SDFs: it nudges the shape-space coordinate by a
// smooth fbm field, so every edge drawn from that coordinate (windows, doors,
// floor lines...) comes out wavy instead of ruler-straight — like a hand that
// couldn't quite follow the line. Each surface calls warpShape() once on its
// own shape coordinate, so facade/roof share one implementation.
//
// Set strength to 0 (via lil-gui) to disable and get perfect edges back.

uniform float uDistortStrength; // displacement amplitude, in the coord's units (m)
uniform float uDistortScale;    // wobble frequency (higher = tighter waviness)

// fbm() comes from paper.glsl (prepended before this module).

// Displace `p` by a smooth 2D noise field. Two decorrelated fbm samples give an
// x/y offset; because fbm is continuous, derivatives stay well-behaved so the
// callers' fwidth()-based antialiasing keeps working.
vec2 warpShape(vec2 p)
{
    if (uDistortStrength <= 0.0) {
        return p;
    }

    float nx = fbm(p * uDistortScale + 13.1);
    float ny = fbm(p * uDistortScale + 71.7);

    return p + (vec2(nx, ny) - 0.5) * uDistortStrength;
}
