varying vec3 vWorldPosition;

uniform float uPaperScale;
uniform mat4 uPaperMatrix;

// Provided by paper.glsl (shared base layer).
vec3 paperColor(vec2 uv);

// Provided by each surface shader (facade, roof, ...).
// Receives the paper base color and paper-space uv, returns the final color
// after stacking that surface's own layers (windows, lines, hatching, ...).
vec3 surfaceLayers(vec3 base, vec2 uv);

void main()
{
    vec3 paperPos = (uPaperMatrix * vec4(vWorldPosition, 1.0)).xyz;

    vec2 uv = paperPos.xy * uPaperScale;

    vec3 base = paperColor(uv);

    vec3 color = surfaceLayers(base, uv);

    gl_FragColor = vec4(color, 1.0);
}
