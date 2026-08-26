varying vec2 vScreenPos;

uniform float uPaperScale;
uniform float uAspect;

vec3 paperColor(vec2 uv);
vec3 applyImperfections(vec3 color, vec3 base, vec2 uv);

void main() {
    vec2 uv = vec2(vScreenPos.x * uAspect, vScreenPos.y) * uPaperScale;
    vec3 base = paperColor(uv);
    vec3 color = applyImperfections(base, base, uv);
    gl_FragColor = vec4(color, 1.0);
}
