// Horizontal roof lines: the engraver's roof shading, running across the roof at
// constant elevation. Reusable on any roof (same pattern as floorLines / hatching),
// so other roof types can compose this as one layer.
//
// The engraved look, matching the Turgot roofs (thin+sparse at the eave, growing
// thicker+denser toward the ridge):
//   - `climb` (0 at the eave, 1 at the ridge) drives BOTH the local line frequency
//     and the stroke thickness, so lines pack tighter AND get heavier going up.
//     Frequency is bounded [density, density+growth], so it can never alias into
//     moire no matter how high the roof sits in world space.
//   - fake lighting from uLightDir modulates on top: faces turned away from the
//     light read a touch heavier. Driven by the world normal, so rotating the
//     scene never changes the shading.
//
// Drawn before the shared imperfection pass, which then erodes/wobbles the lines.

uniform float uRoofLineDensity;       // lines per meter at the eave (bottom)
uniform float uRoofLineDensityGrowth; // extra lines/m added at the ridge (top)
uniform float uRoofLineThicknessMin;  // stroke thickness at the eave (0..1 of spacing)
uniform float uRoofLineThicknessMax;  // stroke thickness at the ridge (0..1 of spacing)
uniform float uRoofLineShadowBoost;   // extra thickness fraction when fully shadowed (0..1)
uniform float uRoofLineStrength;      // overall opacity (0..1)
uniform vec3  uRoofLineInkColor;

// Engrave horizontal lines onto `col`.
//   height : elevation in meters (already warped) — sets the real-world line pitch
//   climb  : 0 at the eave .. 1 at the ridge      — drives density AND thickness
//   light  : 0 (full shadow) .. 1 (fully lit)     — subtle shadow weighting on top
vec3 roofHorizontalLines(vec3 col, float height, float climb, float light)
{
    float t = clamp(climb, 0.0, 1.0);
    float shadow = 1.0 - clamp(light, 0.0, 1.0);

    // Local line frequency, bounded so it stays well above the pixel rate.
    float freq = uRoofLineDensity + uRoofLineDensityGrowth * t;
    float phase = height * freq;

    // Thickness grows with the climb (thin at the eave, heavy at the ridge), with
    // a smaller shadow-driven boost layered on so unlit faces read a touch darker.
    float thickness = mix(uRoofLineThicknessMin, uRoofLineThicknessMax, t);
    thickness *= 1.0 + uRoofLineShadowBoost * shadow;

    // Position inside the current stroke slot, centered on 0, in slot-fractions.
    float p = fract(phase) - 0.5;

    // 1D box SDF. AA from the continuous phase so it stays stable across slot
    // seams (like the facade window grid / hatching).
    float d = abs(p) - thickness * 0.5;
    float aa = clamp(fwidth(phase), 1e-4, 0.4);
    float ink = (1.0 - smoothstep(-aa, aa, d)) * uRoofLineStrength;

    return mix(col, uRoofLineInkColor, ink);
}
