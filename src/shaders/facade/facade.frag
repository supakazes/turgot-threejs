// Facade surface layers: a grid of rectangular windows engraved over the paper.
//
// Two coordinate paths (see facade-windows-plan.md):
//   hasWallData -> normalised wall UV + real wall size => even, centered grid
//   fallback    -> world-space metric coords           => even spacing, uncentered

uniform float uWindowPitch;  // horizontal spacing between windows (m)
uniform float uFloorHeight;  // vertical spacing between floors (m)
uniform vec2  uWindowSize;   // window (width, height) as fraction of a cell
uniform float uGroundHeight; // height (m) reserved at the bottom before row 1 starts
uniform float uFloorCount;   // number of window rows to draw
uniform vec3  uInkColor;

// Signed distance to an axis-aligned box centered at the origin.
float sdBox(vec2 p, vec2 halfSize)
{
    vec2 d = abs(p) - halfSize;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec3 surfaceLayers(vec3 base, vec2 uv, vec2 wallUV, vec2 wallSize, vec2 metric, bool hasWallData)
{
    // Metric position on the wall: horizontal run + height above the ground, both in
    // meters, so ground-start height and floor count behave the same on both paths.
    float along;
    float height;

    if (hasWallData) {
        along = wallUV.x * wallSize.x;
        height = wallUV.y * wallSize.y;
    } else {
        along = metric.x;
        height = metric.y;
    }

    // Rows start above the ground zone and stop after uFloorCount rows.
    float rowSpan = height - uGroundHeight;
    float row = floor(rowSpan / uFloorHeight);
    if (rowSpan < 0.0 || row >= uFloorCount) {
        return base;
    }

    // Continuous cell coordinate (no fract), for stable derivatives.
    vec2 cellCoord = vec2(along / uWindowPitch, rowSpan / uFloorHeight);

    // Position inside the current cell, centered on (0,0).
    vec2 cell = fract(cellCoord) - 0.5;

    // Filled window box.
    vec2 halfSize = 0.5 * uWindowSize;
    float d = sdBox(cell, halfSize);

    // Antialiased ink coverage. AA width comes from the continuous coordinate so it
    // stays stable across cell seams (fwidth(d) would spike where fract() wraps).
    // Clamped so foreshortened/grazing faces can't smear windows into a solid line.
    float aa = clamp(max(fwidth(cellCoord.x), fwidth(cellCoord.y)), 1e-4, 0.05);
    float ink = 1.0 - smoothstep(-aa, aa, d);

    return mix(base, uInkColor, ink);
}
