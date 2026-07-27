// Roof surface layers, stacked on top of the shared paper base.
//
// First roof type (Place Dauphine): horizontal lines at constant elevation whose
// density grows toward the ridge, shaded by the fake light. Other roofs get their
// own surfaceLayers(), reusing roofHorizontalLines() (roofLines.glsl) as a layer.
//
// Two coordinate paths, same as the facade:
//   hasWallData -> wall UV * wall size => elevation + climb from the model's frame
//   fallback    -> world height mapped through uRoofBaseHeight/uRoofSpan

uniform vec3  uLightDir;       // fake light direction (points toward the light)
uniform float uRoofBaseHeight; // world elevation of the eave (m), for the fallback climb
uniform float uRoofSpan;       // roof height from eave to ridge (m), for the fallback climb

// roofHorizontalLines() comes from roofLines.glsl (prepended in roofMaterial.ts).
// warpShape() comes from distortion.glsl (prepended by createPaperMaterial).
vec2 warpShape(vec2 p);

vec3 surfaceLayers(vec3 base, vec2 uv, vec2 wallUV, vec2 wallSize, vec2 metric, bool hasWallData, vec3 worldNormal)
{
    // Elevation sets the real-world line pitch; climb (0 at eave..1 at ridge)
    // drives the density gradient. Prefer the model's authored frame; otherwise
    // fall back to world height mapped through the eave/span uniforms.
    float height = hasWallData ? wallUV.y * wallSize.y : metric.y;
    float climb  = hasWallData ? wallUV.y : (metric.y - uRoofBaseHeight) / max(uRoofSpan, 1e-3);

    // Warp the coordinate up front so the lines come out hand-drawn wavy instead
    // of ruler straight. Disabled when uDistortStrength is 0.
    vec2 warped = warpShape(vec2(metric.x, height));
    height = warped.y;

    // Fake lighting from the roof's orientation (camera-independent): the more the
    // face turns away from uLightDir, the darker it reads. Roofs are sloped, so we
    // use the full 3D normal (unlike facades, which flatten to the vertical plane).
    vec3 n = normalize(worldNormal + vec3(1e-5));
    vec3 l = normalize(uLightDir + vec3(1e-5));
    float light = clamp(dot(n, l) * 0.5 + 0.5, 0.0, 1.0);

    return roofHorizontalLines(base, height, climb, light);
}
