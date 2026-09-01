// Seine water surface layers.
// Blender material name: "la-seine"
//
// Composition (bottom to top):
//   drawWaterLines   — animated parallel engraving lines (waterLines.glsl)
//
// Paper base and imperfection pass are inherited from createPaperMaterial().
// Add new water layers here as separate glsl modules following the same pattern.

vec3 surfaceLayers(vec3 base, vec2 uv, vec2 wallUV, vec2 wallSize, vec2 metric, bool hasWallData, vec3 worldNormal)
{
    return drawWaterLines(base, wallUV);
}
