// Vertical hatching: the engraver's shading strokes running top-to-bottom across
// a facade. Reusable on any building (same pattern as floorLines / doors).
//
// The strokes fake lighting from the facade's orientation, not the camera: the
// more a wall turns away from the light, the darker it reads, so we draw more
// lines (denser) and heavier lines (thicker). A fully lit wall keeps only a
// faint baseline of thin, sparse strokes. Rotating the scene never changes this
// because it is driven by the world normal, not the view direction.
//
// Drawn as the LAST drawing layer (over windows/doors); the shared imperfection
// pass then erodes/wobbles it along with everything else, so some strokes come
// out broken or almost erased.

uniform float uHatchDensity;        // strokes per meter in full shadow (lit facades keep a fraction)
uniform float uHatchThicknessMin;   // stroke thickness when fully lit (0..1 of spacing)
uniform float uHatchThicknessMax;   // stroke thickness when fully shadowed (0..1 of spacing)
uniform float uHatchStrength;       // overall opacity of the hatching (0..1)
uniform vec3  uHatchInkColor;

// Engrave vertical hatching onto `col`. `along` is the (already warped) metric
// coordinate running horizontally along the wall; `light` is 0 (full shadow) to
// 1 (fully lit).
vec3 facadeHatching(vec3 col, float along, float light)
{
    float shadow = 1.0 - clamp(light, 0.0, 1.0);

    // Denser in shadow, down to a faint baseline (never zero) when fully lit.
    float density = uHatchDensity * mix(0.3, 1.0, shadow);

    // Thinner when lit, heavier in shadow.
    float thickness = mix(uHatchThicknessMin, uHatchThicknessMax, shadow);

    // Repeating stroke coordinate. Position inside the current stroke slot,
    // centered on 0, measured in slot-fractions so thickness is a fraction.
    float slot = along * density;
    float p = fract(slot) - 0.5;

    // 1D box SDF: |p| - halfThickness. AA from the continuous coordinate so it
    // stays stable across slot seams (like the window grid).
    float d = abs(p) - thickness * 0.5;
    float aa = clamp(fwidth(slot), 1e-4, 0.4);
    float ink = (1.0 - smoothstep(-aa, aa, d)) * uHatchStrength;

    return mix(col, uHatchInkColor, ink);
}
