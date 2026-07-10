varying vec3 vWorldPosition;

uniform float uPaperScale;
uniform mat4 uPaperMatrix;

vec3 paperColor(vec2 uv);

void main()
{
    vec3 paperPos = (uPaperMatrix * vec4(vWorldPosition, 1.0)).xyz;

    vec2 uv = paperPos.xy * uPaperScale;

    vec3 color = paperColor(uv);

    gl_FragColor = vec4(color, 1.0);
}
