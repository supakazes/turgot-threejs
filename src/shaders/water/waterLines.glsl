// Animated parallel flow lines — reusable water line module.
//
// drawWaterLines(color, wallUV)
//   color   — running ink color passed in from the layer below
//   wallUV  — mesh UV unwrapped so that:
//               U (wallUV.x) = 0→1 along the river (upstream → downstream)
//               V (wallUV.y) = 0→1 across the river (one bank → other bank)
//
// Lines run along iso-V contours so they follow the river's curvature.
// Density is concentrated near both banks (small V and V near 1) and fades
// toward the center, matching the Turgot engraving style.
//
// Dependencies: fbm() from paper.glsl (prepended by createPaperMaterial).

uniform float uWaterLineDensity;    // total lines across the full V range
uniform float uWaterLineThickness;  // fraction of line period filled with ink
uniform float uWaterFlowSpeed;      // animation speed: fbm pattern scrolls along U
uniform float uWaterCurlStrength;   // line wobble amplitude in V
uniform float uWaterCurlScale;      // line wobble spatial frequency along U
uniform float uWaterMergeStrength;  // noise bunching: line-merge illusion strength
uniform float uWaterBankFade;       // V fraction over which lines fade at each bank (0 = off)
uniform float uWaterBankCurve;      // density curve exponent: < 1 = dense at banks, 1 = uniform
uniform vec3  uWaterInkColor;
uniform float uTime;

vec3 drawWaterLines(vec3 color, vec2 wallUV)
{
    // Bank-concentrated density: remap V so samples cluster near V=0 and V=1.
    // t: distance from nearest bank, 0 at bank → 0.5 at center.
    // pow(t*2, curve) with curve < 1: high derivative at t=0 (dense at banks),
    // low derivative at t=0.5 (sparse at center). curve=1 = uniform.
    float t = min(wallUV.y, 1.0 - wallUV.y);
    float tRemap = pow(clamp(t * 2.0, 0.0, 1.0), uWaterBankCurve) * 0.5;
    float vDensity = wallUV.y < 0.5 ? tRemap : 1.0 - tRemap;

    // Curl: wobble V as a function of U so lines are wavy rather than ruler-straight.
    // The fbm pattern scrolls along U over time — this is what animates the flow.
    float curlPhase = wallUV.x * uWaterCurlScale - uTime * uWaterFlowSpeed;
    float curlNoise = fbm(vec2(curlPhase, wallUV.y * uWaterCurlScale * 0.4)) * 2.0 - 1.0;

    // Merge: a second slower noise layer bunches lines together locally,
    // creating the appearance of lines converging and merging at constrictions.
    float mergePhase = wallUV.x * uWaterCurlScale * 0.3 - uTime * uWaterFlowSpeed * 0.5;
    float mergeNoise = fbm(vec2(mergePhase, wallUV.y * uWaterCurlScale * 0.15)) * 2.0 - 1.0;

    float vDisplaced = vDensity
        + curlNoise  * uWaterCurlStrength
        + mergeNoise * uWaterMergeStrength;

    float linePhase = vDisplaced * uWaterLineDensity;

    float f  = fract(linePhase);
    // Clamp aa so the two smoothstep edges stay in order even when zoomed far out.
    float aa = clamp(fwidth(linePhase), 1e-4, uWaterLineThickness * 0.45);
    float line = smoothstep(0.0, aa, f)
               * smoothstep(uWaterLineThickness + aa, uWaterLineThickness, f);

    // Bank fade: lines dissolve toward V = 0 and V = 1 (the quays / banks).
    // Disabled (bankMask = 1) when uWaterBankFade = 0.
    float bankMask = uWaterBankFade > 0.001
        ? smoothstep(0.0, uWaterBankFade, wallUV.y)
          * smoothstep(0.0, uWaterBankFade, 1.0 - wallUV.y)
        : 1.0;

    return mix(color, uWaterInkColor, line * bankMask);
}
