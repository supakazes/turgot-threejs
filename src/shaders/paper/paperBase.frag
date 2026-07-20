varying vec3 vWorldPosition;

// Per-wall frame from paper.vert (see facade-windows-plan.md).
varying vec2 vWallUV;      // normalised 0..1 per wall (0 when model omits UVs)
varying vec2 vWallSize;    // (lengthMeters, heightMeters) per wall (0 when omitted)
varying vec2 vFacadeMetric; // world-space fallback: (alongWall, height) in meters

// provided by createPaperMaterial
uniform float uPaperScale;
uniform mat4 uPaperMatrix;

// Provided by paper.glsl (shared base layer).
vec3 paperColor(vec2 uv);

// Provided by each surface shader (facade, roof, ...).
// Receives the paper base color, paper-space uv, and the per-wall frame:
//   wallUV      normalised wall coords (valid only when hasWallData)
//   wallSize    (lengthMeters, heightMeters) (valid only when hasWallData)
//   metric      world-space (alongWall, height) fallback, always valid
//   hasWallData true when the model supplied wall UV + size
// Returns the final color after stacking that surface's own layers.
vec3 surfaceLayers(vec3 base, vec2 uv, vec2 wallUV, vec2 wallSize, vec2 metric, bool hasWallData);

// Provided by imperfections.glsl: the shared post-shape ink/grain pass.
vec3 applyImperfections(vec3 color, vec3 base, vec2 uv);

void main()
{
    vec3 paperPos = (uPaperMatrix * vec4(vWorldPosition, 1.0)).xyz;

    vec2 uv = paperPos.xy * uPaperScale;

    vec3 base = paperColor(uv);

    bool hasWallData = vWallSize.x > 0.0 && vWallSize.y > 0.0;

    vec3 color = surfaceLayers(base, uv, vWallUV, vWallSize, vFacadeMetric, hasWallData);

    // Final shared pass: rough up the clean, geometric result so it reads as a
    // hand-inked engraving rather than a vector drawing.
    color = applyImperfections(color, base, uv);

    gl_FragColor = vec4(color, 1.0);
}
