// Shared imperfection pass — the final step of every paper material.
//
// Runs AFTER a surface has drawn its shapes (windows, doors, hatching...), so
// it works on the finished ink-on-paper color rather than on geometry. Because
// it lives in the shared paper base, every facade/roof material inherits it for
// free (see createPaperMaterial.ts). Keeps the engraving from looking too clean:
//
//   1. ink transparency — ink is slightly translucent, paper bleeds through
//   2. ink breakup      — noise erodes ink coverage, strokes read dry/broken
//   3. paper grain      — fine tone variation across ink AND paper
//
// Set any strength to 0 (via lil-gui) to disable that effect.

uniform float uInkBreakupScale;    // breakup noise frequency (higher = finer)
uniform float uInkBreakupStrength; // how much ink gets eroded (0..1)
uniform float uInkTransparency;    // how much paper bleeds through ink (0..1)
uniform float uPaperGrainScale;    // grain noise frequency (higher = finer)
uniform float uPaperGrainStrength; // grain intensity

// fbm() comes from paper.glsl (prepended before this module).

// `color` is the surface result (post-shapes), `base` the clean paper tone,
// `uv` the shared paper-space coordinate (so effects lock to the sheet like the
// rest of the paper texture).
vec3 applyImperfections(vec3 color, vec3 base, vec2 uv)
{
    // How much ink sits on the paper here: 0 = blank paper, 1 = solid ink.
    // Derived from how far the surface darkened the paper, so it needs no extra
    // channel plumbed through from the surface shaders.
    float baseLuma = dot(base, vec3(0.299, 0.587, 0.114));
    float colLuma = dot(color, vec3(0.299, 0.587, 0.114));
    float inkMask = clamp((baseLuma - colLuma) / max(baseLuma, 1e-3), 0.0, 1.0);

    // 1. Ink transparency: uniformly let the paper tone show through the ink.
    color = mix(color, base, uInkTransparency * inkMask);

    // 2. Ink breakup: noise erodes ink coverage so strokes look dry and broken,
    //    exposing paper — only where there is ink to erode.
    float n = fbm(uv * uInkBreakupScale);
    float erode = smoothstep(0.35, 0.65, n) * uInkBreakupStrength;
    color = mix(color, base, erode * inkMask);

    // 3. Paper grain: fine additive tone variation over the whole surface
    //    (ink and paper alike), simulating paper tooth and uneven printing.
    float grain = fbm(uv * uPaperGrainScale) - 0.5;
    color += grain * uPaperGrainStrength;

    return color;
}
