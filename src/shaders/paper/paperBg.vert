varying vec2 vScreenPos;

void main() {
    vScreenPos = position.xy;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
