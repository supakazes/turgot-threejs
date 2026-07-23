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

uniform vec3  uLightDir;     // fake light direction (points toward the light)

// sdBox / sdCircle come from sdf.glsl; the door layer from placeDauphineDoor.glsl,
// the vertical hatching from hatching.glsl (all prepended in facadeMaterial.ts).
// warpShape() comes from distortion.glsl (prepended by createPaperMaterial).
vec2 warpShape(vec2 p);

vec3 surfaceLayers(vec3 base, vec2 uv, vec2 wallUV, vec2 wallSize, vec2 metric, bool hasWallData, vec3 worldNormal)
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

    // Warp the shape coordinate once, up front, so every edge drawn from it
    // (doors, floor lines, windows) comes out hand-drawn wavy instead of ruler
    // straight. Disabled when uDistortStrength is 0.
    vec2 warped = warpShape(vec2(along, height));
    along = warped.x;
    height = warped.y;

    // Ground zone: the Place Dauphine door arcade lives below the first row.
    vec3 col = placeDauphineDoors(base, along, height);

    // Double division line between floors (drawn under the windows).
    col = facadeFloorLines(col, height, uGroundHeight, uFloorHeight, uFloorCount);

    // Rows start above the ground zone and stop after uFloorCount rows.
    float rowSpan = height - uGroundHeight;
    float row = floor(rowSpan / uFloorHeight);
    if (rowSpan >= 0.0 && row < uFloorCount) {
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

        col = mix(col, uInkColor, ink);
    }

    // Vertical hatching: the last drawing layer, engraved over everything above.
    // Fake lighting from the facade's orientation (camera-independent): the more
    // the wall turns away from uLightDir, the darker it reads. Vertical walls
    // only, so ignore the vertical component of the normal.
    vec3 flatNormal = normalize(vec3(worldNormal.x, 0.0, worldNormal.z) + vec3(1e-5));
    vec3 flatLight = normalize(vec3(uLightDir.x, 0.0, uLightDir.z) + vec3(1e-5));
    float light = clamp(dot(flatNormal, flatLight) * 0.5 + 0.5, 0.0, 1.0);

    col = facadeHatching(col, along, light);

    return col;
}
