// Floor division lines: the double band (one thin, one thicker) engraved across
// the facade at every floor boundary. Full-width and continuous.
//
// Boundaries sit at height = uGroundHeight + n * uFloorHeight, for n in
// [0, uFloorCount-1]: above the door arcade, then between each window row, but
// not above the last row. Only the nearest boundary is tested per fragment
// (the lines are thin relative to a floor), so no loop over uFloorCount.

uniform float uFloorLineOffset;         // nudge the whole pair up/down from the boundary (m)
uniform float uFloorLineGap;            // vertical gap between the thin and thick line (m)
uniform float uFloorLineThinThickness;  // thickness of the thin line (m)
uniform float uFloorLineThickThickness; // thickness of the thick line (m)
uniform vec3  uFloorLineInkColor;

// groundHeight/floorHeight/floorCount are passed in from facade.frag (its
// uniforms are declared after this module in the concatenated shader).

// Engrave the double floor line onto `col` at `height` meters above the ground.
vec3 facadeFloorLines(vec3 col, float height, float groundHeight, float floorHeight, float floorCount)
{
    float rowSpan = height - groundHeight;

    // Nearest floor boundary index, and its exact height.
    float n = floor(rowSpan / floorHeight + 0.5);
    if (n < 0.0 || n > floorCount - 1.0) {
        return col;
    }
    float boundary = groundHeight + n * floorHeight;

    // The pair is centered on the boundary, shifted by the offset; the thick
    // line sits below the thin one, separated by the gap.
    float center = boundary + uFloorLineOffset;
    float thick = abs(height - (center - uFloorLineGap * 0.5)) - uFloorLineThickThickness * 0.5;
    float thin = abs(height - (center + uFloorLineGap * 0.5)) - uFloorLineThinThickness * 0.5;
    float d = min(thick, thin);

    // Horizontal band: only height varies, so AA comes from fwidth(height).
    float aa = clamp(fwidth(height), 1e-4, 0.05);
    float ink = 1.0 - smoothstep(-aa, aa, d);

    return mix(col, uFloorLineInkColor, ink);
}
